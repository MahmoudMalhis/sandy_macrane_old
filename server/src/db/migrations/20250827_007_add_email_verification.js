export function up(knex) {
  return knex.schema.table("admin_users", (table) => {
    table.boolean("email_verified").defaultTo(false);
    table.string("verification_token").nullable();
    table.timestamp("verification_sent_at").nullable();
    table.timestamp("verification_expires_at").nullable();
  });
}

export function down(knex) {
  return knex.schema.table("admin_users", (table) => {
    table.dropColumn("email_verified");
    table.dropColumn("verification_token");
    table.dropColumn("verification_sent_at");
    table.dropColumn("verification_expires_at");
  });
}
