// server/src/module/contact/service.js

import db from "../../db/knex.js";

/**
 * Create a new contact message (public)
 */
export async function create(data) {
  const [id] = await db("contact_messages").insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject,
    message: data.message,
    ip_address: data.ip_address || null,
    user_agent: data.user_agent || null,
    status: "new",
    priority: "normal",
    created_at: db.fn.now(),
    updated_at: db.fn.now(),
  });

  const message = await db("contact_messages").where({ id }).first();

  return message;
}

/**
 * Get all contact messages with filters (admin)
 */
export async function getAll(filters = {}) {
  const {
    status,
    priority,
    search,
    dateFrom,
    dateTo,
    page = 1,
    limit = 20,
  } = filters;

  let query = db("contact_messages")
    .select(
      "id",
      "name",
      "email",
      "phone",
      "subject",
      "message",
      "status",
      "priority",
      "admin_notes",
      "read_at",
      "replied_at",
      "created_at",
      "updated_at"
    )
    .orderBy("created_at", "desc");

  // Apply filters
  if (status) {
    query = query.where("status", status);
  }

  if (priority) {
    query = query.where("priority", priority);
  }

  if (search) {
    query = query.where(function () {
      this.where("name", "like", `%${search}%`)
        .orWhere("email", "like", `%${search}%`)
        .orWhere("subject", "like", `%${search}%`)
        .orWhere("message", "like", `%${search}%`);
    });
  }

  if (dateFrom) {
    query = query.where("created_at", ">=", dateFrom);
  }

  if (dateTo) {
    query = query.where("created_at", "<=", dateTo);
  }

  // Get total count
  const [{ count }] = await query.clone().count("* as count");
  const total = parseInt(count);

  // Apply pagination
  const offset = (page - 1) * limit;
  const messages = await query.limit(limit).offset(offset);

  return {
    messages,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

/**
 * Get contact message by ID (admin)
 */
export async function getById(id) {
  const message = await db("contact_messages").where({ id }).first();

  if (!message) {
    throw new Error("Message not found");
  }

  return message;
}

/**
 * Update message status (admin)
 */
export async function updateStatus(id, status, adminNotes = null) {
  const message = await getById(id);

  const updateData = {
    status,
    updated_at: db.fn.now(),
  };

  // Mark as read when status changes from 'new'
  if (message.status === "new" && status !== "new" && !message.read_at) {
    updateData.read_at = db.fn.now();
  }

  // Mark as replied when status is 'replied'
  if (status === "replied" && !message.replied_at) {
    updateData.replied_at = db.fn.now();
  }

  if (adminNotes !== null) {
    updateData.admin_notes = adminNotes;
  }

  await db("contact_messages").where({ id }).update(updateData);

  return getById(id);
}

/**
 * Update priority (admin)
 */
export async function updatePriority(id, priority) {
  await getById(id); // Check if exists

  await db("contact_messages").where({ id }).update({
    priority,
    updated_at: db.fn.now(),
  });

  return getById(id);
}

/**
 * Add/Update admin notes (admin)
 */
export async function updateNotes(id, notes) {
  await getById(id); // Check if exists

  await db("contact_messages").where({ id }).update({
    admin_notes: notes,
    updated_at: db.fn.now(),
  });

  return getById(id);
}

/**
 * Mark as read (admin)
 */
export async function markAsRead(id, userId = null) {
  const message = await getById(id);

  if (!message.read_at) {
    const updateData = {
      read_at: db.fn.now(),
      updated_at: db.fn.now(),
    };

    // Change status from 'new' to 'read' automatically
    if (message.status === "new") {
      updateData.status = "read";
    }

    await db("contact_messages").where({ id }).update(updateData);
  }

  return getById(id);
}

/**
 * Delete message (admin)
 */
export async function deleteMessage(id) {
  const message = await getById(id);

  await db("contact_messages").where({ id }).del();

  return message;
}

/**
 * Get statistics (admin)
 */
export async function getStats() {
  // Total messages
  const [{ total }] = await db("contact_messages").count("* as total");

  // By status
  const statusCounts = await db("contact_messages")
    .select("status")
    .count("* as count")
    .groupBy("status");

  const statusStats = statusCounts.reduce((acc, item) => {
    acc[item.status] = parseInt(item.count);
    return acc;
  }, {});

  // By priority
  const priorityCounts = await db("contact_messages")
    .select("priority")
    .count("* as count")
    .groupBy("priority");

  const priorityStats = priorityCounts.reduce((acc, item) => {
    acc[item.priority] = parseInt(item.count);
    return acc;
  }, {});

  // Recent (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [{ recent }] = await db("contact_messages")
    .where("created_at", ">=", sevenDaysAgo)
    .count("* as recent");

  // Unread count
  const [{ unread }] = await db("contact_messages")
    .where("status", "new")
    .count("* as unread");

  // Response rate (replied / total)
  const [{ replied }] = await db("contact_messages")
    .whereNotNull("replied_at")
    .count("* as replied");

  const responseRate =
    parseInt(total) > 0
      ? ((parseInt(replied) / parseInt(total)) * 100).toFixed(1)
      : 0;

  return {
    total: parseInt(total),
    unread: parseInt(unread),
    recent: parseInt(recent),
    responseRate: parseFloat(responseRate),
    byStatus: {
      new: statusStats.new || 0,
      read: statusStats.read || 0,
      in_progress: statusStats.in_progress || 0,
      replied: statusStats.replied || 0,
      archived: statusStats.archived || 0,
    },
    byPriority: {
      low: priorityStats.low || 0,
      normal: priorityStats.normal || 0,
      high: priorityStats.high || 0,
      urgent: priorityStats.urgent || 0,
    },
  };
}

/**
 * Generate email reply template (admin)
 */
export async function generateReplyTemplate(id) {
  const message = await getById(id);

  const template = `
مرحباً ${message.name}،

شكراً لتواصلك معنا بخصوص: ${message.subject}

[اكتب ردك هنا]

مع تحياتنا،
فريق ساندي مكرمية
  `.trim();

  return {
    to: message.email,
    subject: `رد على: ${message.subject}`,
    body: template,
  };
}
