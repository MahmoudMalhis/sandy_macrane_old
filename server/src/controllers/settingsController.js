import db from "../config/database.js";

export const getSettings = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM settings");
    const settings = {};
    rows.forEach((row) => {
      settings[row.key] = row.value; // تم تصحيح أسماء الحقول
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "database error" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      // تم إصلاح Object.entries
      await db.execute(
        "INSERT INTO settings (`key`, `value`) VALUES (?,?) ON DUPLICATE KEY UPDATE `value` = ?", // تم إصلاح SQL syntax
        [key, value, value]
      );
    }

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};
