import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('user', (table) => {
    table.string('hash');
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('user', (table) => {
    table.dropColumn('hash');
  })
}

