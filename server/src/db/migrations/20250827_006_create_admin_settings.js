export function up (knex) {
  return knex.schema.createTable("settings", (table) => {
    table.increments("id").primary();
    table.string("key").unique().notNullable();
    table.text("value").nullable();
    table.timestamps(true, true);

    // Indexes
    table.index(["key"]);
  });
}

export function down (knex) {
  return knex.schema.dropTable("settings");
}
