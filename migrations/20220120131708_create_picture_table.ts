import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('picture', function(table) {
        table.increments('id').primary();
        table.string('title' ,255).notNullable();
        table.integer('createdBy').unsigned().references('id').inTable('user').onDelete('SET NULL');
        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.string('filename').notNullable();
        table.string('filepath').notNullable();
        table.string('mimetype').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('picture');
}