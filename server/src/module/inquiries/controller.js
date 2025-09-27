import {
  create as _create,
  getAll as _getAll,
  getById as _getById,
  updateStatus as _updateStatus,
  deleteInquiry as _delete, // إصلاح الاستيراد
  getStats as _getStats,
  generateWhatsAppLink as _generateWhatsAppLink,
} from "./service.js";
import { info, error as _error } from "../../utils/logger.js";

class InquiriesController {
  // Create new inquiry (public)
  static async create(req, res) {
    try {
      const { customer_name, phone_whatsapp, product_type, album_id, notes } =
        req.body;

      const result = await _create({
        customer_name,
        phone_whatsapp,
        product_type,
        album_id: album_id ? parseInt(album_id) : null,
        notes,
        source: "form",
      });

      info("New inquiry created", {
        inquiryId: result.inquiry.id,
        customer_name,
        product_type,
        album_id,
      });

      res.status(201).json({
        success: true,
        message: "تم إرسال طلبك بنجاح وسيتم التواصل معك قريباً",
        data: {
          inquiry: result.inquiry,
          whatsappLink: result.whatsappLink,
        },
      });
    } catch (error) {
      _error("Create inquiry failed", {
        inquiryData: req.body,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في إرسال الطلب، يرجى المحاولة مرة أخرى",
      });
    }
  }

  // Get all inquiries (admin)
  static async getAll(req, res) {
    try {
      const { status, product_type, phone, dateFrom, dateTo, page, limit } =
        req.query;

      const result = await _getAll({
        status,
        product_type,
        phone,
        dateFrom,
        dateTo,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      });

      res.json({
        success: true,
        data: result.inquiries,
        pagination: result.pagination,
      });
    } catch (error) {
      _error("Get inquiries failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch inquiries",
      });
    }
  }

  // Get inquiry by ID (admin)
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const inquiry = await _getById(parseInt(id));

      res.json({
        success: true,
        data: inquiry,
      });
    } catch (error) {
      if (error.message === "Inquiry not found") {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found",
        });
      }

      _error("Get inquiry failed", {
        inquiryId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to fetch inquiry",
      });
    }
  }

  // Update inquiry status (admin)
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const inquiry = await _updateStatus(parseInt(id), status, notes);

      info("Inquiry status updated", {
        inquiryId: parseInt(id),
        newStatus: status,
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Inquiry status updated successfully",
        data: inquiry,
      });
    } catch (error) {
      if (error.message === "Inquiry not found") {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found",
        });
      }

      _error("Update inquiry status failed", {
        inquiryId: req.params.id,
        updatedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update inquiry status",
      });
    }
  }

  // Delete inquiry (admin)
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const inquiry = await _delete(parseInt(id));

      info("Inquiry deleted", {
        inquiryId: parseInt(id),
        customer: inquiry.customer_name,
        deletedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Inquiry deleted successfully",
        data: inquiry,
      });
    } catch (error) {
      if (error.message === "Inquiry not found") {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found",
        });
      }

      _error("Delete inquiry failed", {
        inquiryId: req.params.id,
        deletedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to delete inquiry",
      });
    }
  }

  // Get inquiries statistics (admin)
  static async getStats(req, res) {
    try {
      const stats = await _getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      _error("Get inquiries stats failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
      });
    }
  }

  // Generate WhatsApp link for inquiry (admin)
  static async generateWhatsAppLink(req, res) {
    try {
      const { id } = req.params;
      const whatsappLink = await _generateWhatsAppLink(parseInt(id));

      res.json({
        success: true,
        data: {
          whatsappLink,
        },
      });
    } catch (error) {
      if (error.message === "Inquiry not found") {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found",
        });
      }

      _error("Generate WhatsApp link failed", {
        inquiryId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to generate WhatsApp link",
      });
    }
  }
}

// Export named functions
export const create = InquiriesController.create;
export const getAll = InquiriesController.getAll;
export const getById = InquiriesController.getById;
export const updateStatus = InquiriesController.updateStatus;
export const getStats = InquiriesController.getStats;
export const generateWhatsAppLink = InquiriesController.generateWhatsAppLink;

// Export delete with alternative name
export { InquiriesController as delete };
export const deleteInquiry = InquiriesController.delete;

export default InquiriesController;
