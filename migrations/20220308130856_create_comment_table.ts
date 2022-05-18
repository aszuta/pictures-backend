import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('comment', function (table) {
        table.increments('id').primary();
        table.integer('postId').unsigned().references('id').inTable('picture').onDelete('CASCADE');
        table.integer('userId').unsigned().references('id').inTable('user').onDelete('CASCADE');
        table.string('name').notNullable();
        table.string('content').notNullable();
        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('comment');
}