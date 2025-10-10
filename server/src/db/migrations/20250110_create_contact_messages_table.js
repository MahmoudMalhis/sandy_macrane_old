
export function up(knex) {
  return knex.schema.createTable("contact_messages", (table) => {
    
    table.increments("id").primary();

    
    table.string("name", 100).notNullable();
    table.string("email", 150).notNullable();
    table.string("phone", 20).nullable();
    table.string("subject", 200).notNullable();
    table.text("message").notNullable();

    
    table
      .enum("status", ["new", "read", "in_progress", "replied", "archived"])
      .defaultTo("new")
      .notNullable();

    
    table
      .enum("priority", ["low", "normal", "high", "urgent"])
      .defaultTo("normal")
      .notNullable();

    
    table.text("admin_notes").nullable();

    
    table.string("ip_address", 45).nullable();
    table.string("user_agent", 255).nullable();

    
    table.timestamp("read_at").nullable();
    table.timestamp("replied_at").nullable();
    table.integer("replied_by").unsigned().nullable();

    
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    
    table.index(["status", "created_at"]);
    table.index(["email"]);
    table.index(["created_at"]);
    table.index(["priority"]);

    
    
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("contact_messages");
}
