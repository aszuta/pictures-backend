import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('saved', function (table) {
        table.integer('userId').unsigned().references('id').inTable('user').onDelete('CASCADE');
        table.integer('postId').unsigned().references('id').inTable('picture').onDelete('CASCADE');
        table.primary(['userId', 'postId']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('saved');
}

