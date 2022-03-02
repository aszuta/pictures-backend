import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('picture', function(table) {
        table.increments('id');
        table.string('title');
        table.string('createdBy');
        table.string('filename');
        table.string('filepath');
        table.string('mimetype');
        table.integer('size');
        table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('picture');
}

