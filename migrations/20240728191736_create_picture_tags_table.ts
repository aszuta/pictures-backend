import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('picture_tags', function (table) {
        table.integer('postId').unsigned().references('id').inTable('picture').onDelete('CASCADE');
        table.integer('tagId').unsigned().references('id').inTable('tags').onDelete('CASCADE');
        table.primary(['postId', 'tagId']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('picture_tags');
}

