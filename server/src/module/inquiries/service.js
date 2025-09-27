import db, { fn } from "../../db/knex.js";
import { createInquiryWhatsAppLink } from "../../utils/whatsapp.js";

class InquiriesService {
  // Create new inquiry
  static async create(inquiryData) {
    try {
      const {
        customer_name,
        phone_whatsapp,
        product_type,
        album_id = null,
        notes = null,
        source = "form",
      } = inquiryData;

      const [inquiryId] = await db("inquiries").insert({
        customer_name,
        phone_whatsapp,
        product_type,
        album_id,
        notes,
        source,
        status: "new",
        created_at: fn.now(),
        updated_at: fn.now(),
      });

      const inquiry = await this.getById(inquiryId);

      // Generate WhatsApp link
      let album = null;
      if (album_id) {
        album = await db("albums").where("id", album_id).first();
      }

      const whatsappLink = await createInquiryWhatsAppLink(inquiry, album);

      return {
        inquiry,
        whatsappLink,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all inquiries (admin)
  static async getAll(filters = {}) {
    try {
      const {
        status,
        product_type,
        phone,
        dateFrom,
        dateTo,
        page = 1,
        limit = 20,
      } = filters;

      let query = db("inquiries")
        .select(
          "inquiries.*",
          "albums.title as album_title",
          "albums.slug as album_slug"
        )
        .leftJoin("albums", "inquiries.album_id", "albums.id");

      // Apply filters
      if (status) {
        query = query.where("inquiries.status", status);
      }

      if (product_type) {
        query = query.where("inquiries.product_type", product_type);
      }

      if (phone) {
        query = query.where("inquiries.phone_whatsapp", "like", `%${phone}%`);
      }

      if (dateFrom) {
        query = query.where("inquiries.created_at", ">=", dateFrom);
      }

      if (dateTo) {
        query = query.where("inquiries.created_at", "<=", dateTo + " 23:59:59");
      }

      // Sorting
      query = query.orderBy("inquiries.created_at", "desc");

      // Pagination
      const offset = (page - 1) * limit;
      const inquiries = await query.limit(limit).offset(offset);

      // Get total count
      const totalQuery = db("inquiries");
      if (status) totalQuery.where("status", status);
      if (product_type) totalQuery.where("product_type", product_type);
      if (phone) totalQuery.where("phone_whatsapp", "like", `%${phone}%`);
      if (dateFrom) totalQuery.where("created_at", ">=", dateFrom);
      if (dateTo) totalQuery.where("created_at", "<=", dateTo + " 23:59:59");

      const [{ count }] = await totalQuery.count("* as count");

      return {
        inquiries,
        pagination: {
          total: parseInt(count),
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get inquiry by ID
  static async getById(id) {
    try {
      const inquiry = await db("inquiries")
        .select(
          "inquiries.*",
          "albums.title as album_title",
          "albums.slug as album_slug",
          "albums.cover_image as album_cover"
        )
        .leftJoin("albums", "inquiries.album_id", "albums.id")
        .where("inquiries.id", id)
        .first();

      if (!inquiry) {
        throw new Error("Inquiry not found");
      }

      return inquiry;
    } catch (error) {
      throw error;
    }
  }

  // Update inquiry status
  static async updateStatus(id, status, notes = null) {
    try {
      await this.getById(id); // Check if exists

      const updateData = {
        status,
        updated_at: fn.now(),
      };

      if (notes !== null) {
        updateData.notes = notes;
      }

      await db("inquiries").where("id", id).update(updateData);

      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete inquiry
  static async delete(id) {
    try {
      const inquiry = await this.getById(id);

      await db("inquiries").where("id", id).del();

      return inquiry;
    } catch (error) {
      throw error;
    }
  }

  // Get inquiries statistics
  static async getStats() {
    try {
      const [totalInquiries] = await db("inquiries").count("* as count");
      const [newInquiries] = await db("inquiries")
        .where("status", "new")
        .count("* as count");
      const [inReviewInquiries] = await db("inquiries")
        .where("status", "in_review")
        .count("* as count");
      const [contactedInquiries] = await db("inquiries")
        .where("status", "contacted")
        .count("* as count");
      const [closedInquiries] = await db("inquiries")
        .where("status", "closed")
        .count("* as count");

      // Get inquiries by product type
      const [macrameInquiries] = await db("inquiries")
        .where("product_type", "macrame")
        .count("* as count");
      const [frameInquiries] = await db("inquiries")
        .where("product_type", "frame")
        .count("* as count");

      // Get recent inquiries (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [recentInquiries] = await db("inquiries")
        .where("created_at", ">=", sevenDaysAgo.toISOString())
        .count("* as count");

      return {
        total: parseInt(totalInquiries.count),
        byStatus: {
          new: parseInt(newInquiries.count),
          in_review: parseInt(inReviewInquiries.count),
          contacted: parseInt(contactedInquiries.count),
          closed: parseInt(closedInquiries.count),
        },
        byProductType: {
          macrame: parseInt(macrameInquiries.count),
          frame: parseInt(frameInquiries.count),
        },
        recent: parseInt(recentInquiries.count),
      };
    } catch (error) {
      throw error;
    }
  }

  // Generate WhatsApp contact link for inquiry
  static async generateWhatsAppLink(id) {
    try {
      const inquiry = await this.getById(id);

      let album = null;
      if (inquiry.album_id) {
        album = await db("albums").where("id", inquiry.album_id).first();
      }

      return await createInquiryWhatsAppLink(inquiry, album);
    } catch (error) {
      throw error;
    }
  }
}

// Export named functions
export const create = InquiriesService.create.bind(InquiriesService);
export const getAll = InquiriesService.getAll.bind(InquiriesService);
export const getById = InquiriesService.getById.bind(InquiriesService);
export const updateStatus =
  InquiriesService.updateStatus.bind(InquiriesService);
export const getStats = InquiriesService.getStats.bind(InquiriesService);
export const generateWhatsAppLink =
  InquiriesService.generateWhatsAppLink.bind(InquiriesService);

// Export delete with alternative name
export const deleteInquiry = InquiriesService.delete.bind(InquiriesService);
export { InquiriesService as delete };

export default InquiriesService;
