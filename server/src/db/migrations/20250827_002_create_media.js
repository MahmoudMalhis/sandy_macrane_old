export function up (knex) {
  return knex.schema.createTable("media", (table) => {
    table.increments("id").primary();
    table.integer("album_id").unsigned().notNullable();
    table.string("url").notNullable();
    table.string("alt").nullable();
    table.boolean("is_cover").defaultTo(false);
    table.integer("sort_order").unsigned().defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Foreign key
    table
      .foreign("album_id")
      .references("id")
      .inTable("albums")
      .onDelete("CASCADE");

    // Indexes
    table.index(["album_id", "sort_order"]);
    table.index(["album_id", "is_cover"]);
  });
}

export function down (knex) {
  return knex.schema.dropTable("media");
}
