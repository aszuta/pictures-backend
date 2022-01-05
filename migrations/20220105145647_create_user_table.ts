import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', function (table) {
    table.increments('id');
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user');
}

