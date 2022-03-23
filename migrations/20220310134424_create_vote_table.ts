import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('vote', function (table) {
        table.increments('id').primary();
        table.string('voteType').notNullable();
        table.integer('userId').notNullable();
        table.integer('postId').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('vote');
}

