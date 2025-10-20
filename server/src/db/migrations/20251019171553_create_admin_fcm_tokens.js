export const up = async (knex) => {
  await knex.schema.createTable("admin_fcm_tokens", (table) => {
    table.increments("id").primary();
    table.integer("admin_id").unsigned().notNullable();
    table.string("fcm_token", 500).notNullable().unique();
    table.string("device_info", 500).nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("last_used_at").defaultTo(knex.fn.now());
    table.foreign("admin_id").references("admin_users.id").onDelete("CASCADE");
    table.index("admin_id");
    table.index("fcm_token");
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists("admin_fcm_tokens");
};
