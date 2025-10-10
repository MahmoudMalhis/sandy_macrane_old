// server/src/module/contact/controller.js

import {
  create as _create,
  getAll as _getAll,
  getById as _getById,
  updateStatus as _updateStatus,
  updatePriority as _updatePriority,
  updateNotes as _updateNotes,
  markAsRead as _markAsRead,
  deleteMessage as _deleteMessage,
  getStats as _getStats,
  generateReplyTemplate as _generateReplyTemplate,
} from "./service.js";
import { info, error as _error } from "../../utils/logger.js";

class ContactController {
  /**
   * Create new contact message (public)
   */
  static async create(req, res) {
    try {
      const { name, email, phone, subject, message } = req.body;

      // Get IP and User Agent
      const ip_address =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const user_agent = req.headers["user-agent"];

      const contactMessage = await _create({
        name,
        email,
        phone,
        subject,
        message,
        ip_address,
        user_agent,
      });

      info("New contact message received", {
        messageId: contactMessage.id,
        name,
        email,
        subject,
      });

      res.status(201).json({
        success: true,
        message: "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً!",
        data: {
          id: contactMessage.id,
          created_at: contactMessage.created_at,
        },
      });
    } catch (error) {
      _error("Create contact message failed", {
        data: req.body,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
      });
    }
  }

  /**
   * Get all contact messages (admin)
   */
  static async getAll(req, res) {
    try {
      const { status, priority, search, dateFrom, dateTo, page, limit } =
        req.query;

      const result = await _getAll({
        status,
        priority,
        search,
        dateFrom,
        dateTo,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      });

      res.json({
        success: true,
        data: result.messages,
        pagination: result.pagination,
      });
    } catch (error) {
      _error("Get contact messages failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
      });
    }
  }

  /**
   * Get contact message by ID (admin)
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const message = await _getById(parseInt(id));

      // Auto-mark as read when viewed
      if (message.status === "new") {
        await _markAsRead(parseInt(id), req.user?.id);
      }

      res.json({
        success: true,
        data: message,
      });
    } catch (error) {
      if (error.message === "Message not found") {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      _error("Get contact message failed", {
        messageId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to fetch message",
      });
    }
  }

  /**
   * Update message status (admin)
   */
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, admin_notes } = req.body;

      const message = await _updateStatus(
        parseInt(id),
        status,
        admin_notes || null
      );

      info("Contact message status updated", {
        messageId: parseInt(id),
        newStatus: status,
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Status updated successfully",
        data: message,
      });
    } catch (error) {
      if (error.message === "Message not found") {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      _error("Update message status failed", {
        messageId: req.params.id,
        updatedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update status",
      });
    }
  }

  /**
   * Update message priority (admin)
   */
  static async updatePriority(req, res) {
    try {
      const { id } = req.params;
      const { priority } = req.body;

      const message = await _updatePriority(parseInt(id), priority);

      info("Contact message priority updated", {
        messageId: parseInt(id),
        newPriority: priority,
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Priority updated successfully",
        data: message,
      });
    } catch (error) {
      if (error.message === "Message not found") {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      _error("Update message priority failed", {
        messageId: req.params.id,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update priority",
      });
    }
  }

  /**
   * Update admin notes (admin)
   */
  static async updateNotes(req, res) {
    try {
      const { id } = req.params;
      const { admin_notes } = req.body;

      const message = await _updateNotes(parseInt(id), admin_notes);

      res.json({
        success: true,
        message: "Notes updated successfully",
        data: message,
      });
    } catch (error) {
      if (error.message === "Message not found") {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update notes",
      });
    }
  }

  /**
   * Mark message as read (admin)
   */
  static async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const message = await _markAsRead(parseInt(id), req.user?.id);

      res.json({
        success: true,
        message: "Message marked as read",
        data: message,
      });
    } catch (error) {
      if (error.message === "Message not found") {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to mark as read",
      });
    }
  }

  /**
   * Delete message (admin)
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const message = await _deleteMessage(parseInt(id));

      info("Contact message deleted", {
        messageId: parseInt(id),
        customer: message.name,
        deletedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Message deleted successfully",
        data: message,
      });
    } catch (error) {
      if (error.message === "Message not found") {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      _error("Delete contact message failed", {
        messageId: req.params.id,
        deletedBy: req.user?.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to delete message",
      });
    }
  }

  /**
   * Get statistics (admin)
   */
  static async getStats(req, res) {
    try {
      const stats = await _getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      _error("Get contact stats failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
      });
    }
  }

  /**
   * Generate reply template (admin)
   */
  static async generateReplyTemplate(req, res) {
    try {
      const { id } = req.params;
      const template = await _generateReplyTemplate(parseInt(id));

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      if (error.message === "Message not found") {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to generate template",
      });
    }
  }
}

// Export named functions
export const create = ContactController.create;
export const getAll = ContactController.getAll;
export const getById = ContactController.getById;
export const updateStatus = ContactController.updateStatus;
export const updatePriority = ContactController.updatePriority;
export const updateNotes = ContactController.updateNotes;
export const markAsRead = ContactController.markAsRead;
export const getStats = ContactController.getStats;
export const generateReplyTemplate = ContactController.generateReplyTemplate;

// Export delete with alternative name
export { ContactController as delete };
export const deleteMessage = ContactController.delete;

export default ContactController;
