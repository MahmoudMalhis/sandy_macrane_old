export function up (knex) {
  return knex.schema.createTable("admin_users", (table) => {
    table.increments("id").primary();
    table.string("email").unique().notNullable();
    table.string("password_hash").notNullable();
    table.enum("role", ["owner", "editor"]).defaultTo("editor");
    table.timestamp("last_login_at").nullable();
    table.timestamps(true, true);

    // Indexes
    table.index(["email"]);
  });
}

export function down (knex) {
  return knex.schema.dropTable("admin_users");
}
