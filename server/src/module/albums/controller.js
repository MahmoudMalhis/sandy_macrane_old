import {
  getAll as _getAll,
  getBySlug as _getBySlug,
  getById as _getById,
  create as _create,
  update as _update,
  deleteAlbum as _delete, // تم تغيير هذا السطر
  getFeatured as _getFeatured,
  getStats as _getStats,
} from "./service.js";
import { error as _error, info } from "../../utils/logger.js";

class AlbumsController {
  // Get all albums (public)
  static async getAll(req, res) {
    try {
      const { category, search, sort, page, limit } = req.query;

      const result = await _getAll({
        category,
        search,
        sort,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 12,
        status: "published", // Only published for public
      });

      res.json({
        success: true,
        data: result.albums,
        pagination: result.pagination,
      });
    } catch (error) {
      _error("Get albums failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch albums",
      });
    }
  }

  // Get all albums (admin)
  static async getAllAdmin(req, res) {
    try {
      const { category, status, search, sort, page, limit } = req.query;

      const result = await _getAll({
        category,
        status,
        search,
        sort,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 12,
      });

      res.json({
        success: true,
        data: result.albums,
        pagination: result.pagination,
      });
    } catch (error) {
      _error("Get albums admin failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch albums",
      });
    }
  }

  // Get album by slug (public)
  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const album = await _getBySlug(slug);

      // Check if album is published (for public access)
      if (album.status !== "published") {
        return res.status(404).json({
          success: false,
          message: "Album not found",
        });
      }

      res.json({
        success: true,
        data: album,
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "Album not found",
        });
      }

      _error("Get album by slug failed", {
        slug: req.params.slug,
        error: error.message,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch album",
      });
    }
  }

  // Get album by ID (admin)
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const album = await _getById(parseInt(id));

      res.json({
        success: true,
        data: album,
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "Album not found",
        });
      }

      _error("Get album by ID failed", {
        id: req.params.id,
        error: error.message,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch album",
      });
    }
  }

  // Create album (admin)
  static async create(req, res) {
    try {
      const albumData = req.body;
      const album = await _create(albumData);

      info("Album created", {
        albumId: album.id,
        title: album.title,
        createdBy: req.user.email,
      });

      res.status(201).json({
        success: true,
        message: "Album created successfully",
        data: album,
      });
    } catch (error) {
      _error("Create album failed", {
        albumData: req.body,
        createdBy: req.user.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to create album",
      });
    }
  }

  // Update album (admin)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const albumData = req.body;

      const album = await _update(parseInt(id), albumData);

      info("Album updated", {
        albumId: album.id,
        title: album.title,
        updatedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Album updated successfully",
        data: album,
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "Album not found",
        });
      }

      _error("Update album failed", {
        albumId: req.params.id,
        updatedBy: req.user.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update album",
      });
    }
  }

  // Delete album (admin)
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const album = await _delete(parseInt(id));

      info("Album deleted", {
        albumId: album.id,
        title: album.title,
        deletedBy: req.user.email,
      });

      res.json({
        success: true,
        message: "Album deleted successfully",
        data: album,
      });
    } catch (error) {
      if (error.message === "Album not found") {
        return res.status(404).json({
          success: false,
          message: "Album not found",
        });
      }

      _error("Delete album failed", {
        albumId: req.params.id,
        deletedBy: req.user.email,
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to delete album",
      });
    }
  }

  // Get featured albums (public)
  static async getFeatured(req, res) {
    try {
      const { limit } = req.query;
      const albums = await _getFeatured(parseInt(limit) || 6);

      res.json({
        success: true,
        data: albums,
      });
    } catch (error) {
      _error("Get featured albums failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch featured albums",
      });
    }
  }

  // Get albums statistics (admin)
  static async getStats(req, res) {
    try {
      const stats = await _getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      _error("Get albums stats failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
      });
    }
  }
}

// Export named functions
export const getAll = AlbumsController.getAll;
export const getAllAdmin = AlbumsController.getAllAdmin;
export const getBySlug = AlbumsController.getBySlug;
export const getById = AlbumsController.getById;
export const create = AlbumsController.create;
export const update = AlbumsController.update;
export const getFeatured = AlbumsController.getFeatured;
export const getStats = AlbumsController.getStats;
export const deleteAlbum = AlbumsController.delete.bind(AlbumsController);

export default AlbumsController;
