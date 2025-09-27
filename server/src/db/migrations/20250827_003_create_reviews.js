export function up(knex) {
  return knex.schema.createTable("reviews", (table) => {
    table.increments("id").primary();
    table.string("author_name").notNullable();
    table.tinyint("rating").unsigned().notNullable().checkBetween([1, 5]);
    table.text("text").notNullable();
    table.string("attached_image").nullable();
    table.integer("linked_album_id").unsigned().nullable();
    table
      .enum("status", ["pending", "published", "hidden"])
      .defaultTo("pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Foreign key
    table
      .foreign("linked_album_id")
      .references("id")
      .inTable("albums")
      .onDelete("SET NULL");

    // Indexes
    table.index(["status", "created_at"]);
    table.index(["linked_album_id"]);
  });
}

export function down(knex) {
  return knex.schema.dropTable("reviews");
}
