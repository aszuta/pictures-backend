import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('comment', function (table) {
        table.increments('id').primary();
        table.string('postId');
        table.string('name').notNullable();
        table.string('content').notNullable();
        table.timestamp('date');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('comment');
}

