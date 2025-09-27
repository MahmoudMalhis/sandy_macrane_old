export function up (knex) {
  return knex.schema.createTable("albums", (table) => {
    table.increments("id").primary();
    table.string("slug").unique().notNullable();
    table.string("title").notNullable();
    table.enum("category", ["macrame", "frame"]).notNullable();
    table.string("cover_image").nullable();
    table.text("description").nullable();
    table.text("maker_note").nullable();
    table.json("tags").nullable();
    table.enum("status", ["draft", "published"]).defaultTo("draft");
    table.integer("view_count").unsigned().defaultTo(0);
    table.timestamps(true, true);

    // Indexes
    table.index(["category", "status", "created_at"]);
    table.index(["slug"]);
    table.index(["status", "created_at"]);
  });
}

export function down (knex) {
  return knex.schema.dropTable("albums");
}
