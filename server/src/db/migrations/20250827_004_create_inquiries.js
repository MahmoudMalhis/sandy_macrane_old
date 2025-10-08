export function up(knex) {
  return knex.schema.createTable("inquiries", (table) => {
    table.increments("id").primary();
    table.string("customer_name").notNullable();
    table.string("phone_whatsapp").notNullable();
    table.enum("product_type", ["macrame", "frame", "other"]).notNullable();
    table.integer("album_id").unsigned().nullable();
    table.text("notes").nullable();
    table.enum("source", ["form", "whatsapp", "instagram"]).defaultTo("form");
    table
      .enum("status", ["new", "in_review", "contacted", "closed"])
      .defaultTo("new");
    table.timestamps(true, true);

    // Foreign key
    table
      .foreign("album_id")
      .references("id")
      .inTable("albums")
      .onDelete("SET NULL");

    // Indexes
    table.index(["status", "created_at"]);
    table.index(["phone_whatsapp"]);
    table.index(["product_type"]);
  });
}

export function down(knex) {
  return knex.schema.dropTable("inquiries");
}
