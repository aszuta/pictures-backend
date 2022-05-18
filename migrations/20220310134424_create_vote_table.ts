import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('vote', function (table) {
        table.increments('id').primary();
        table.string('voteType').notNullable();
        table.integer('userId').unsigned().references('id').inTable('user').onDelete('CASCADE');
        table.integer('postId').unsigned().references('id').inTable('picture').onDelete('CASCADE');
        table.unique(['userId', 'postId']);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('vote');
}