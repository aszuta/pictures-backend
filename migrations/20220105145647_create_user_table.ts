import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', function (table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('password', 255).notNullable();
    table.string('avatar', 255);
    table.string('refresh', 255);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user');
}