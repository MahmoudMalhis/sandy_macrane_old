export function up(knex) {
  return knex.schema.table("albums", (table) => {
    table.integer("likes_count").unsigned().defaultTo(0).notNullable();
    table.index(["likes_count"]);
  });
}

export function down(knex) {
  return knex.schema.table("albums", (table) => {
    table.dropColumn("likes_count");
  });
}
