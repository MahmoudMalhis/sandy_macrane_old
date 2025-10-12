export async function up(knex) {
  // التحقق من وجود جدول admin_users
  const hasAdminUsersTable = await knex.schema.hasTable("admin_users");
  if (!hasAdminUsersTable) {
    throw new Error(
      "❌ admin_users table does not exist. Please create it first."
    );
  }

  console.log("✅ admin_users table exists");

  // جدول الإشعارات
  const hasNotifications = await knex.schema.hasTable("notifications");
  if (!hasNotifications) {
    await knex.schema.createTable("notifications", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.string("type", 50).notNullable();
      table.string("title", 255).notNullable();
      table.text("message").notNullable();
      table.boolean("read").defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());

      // Foreign key
      table
        .foreign("user_id")
        .references("id")
        .inTable("admin_users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

      table.index(["user_id", "read"]);
      table.index("created_at");
    });

    console.log("✅ Created notifications table");
  } else {
    console.log("ℹ️  notifications table already exists");
  }

  console.log("✅ Migration completed successfully!");
}
