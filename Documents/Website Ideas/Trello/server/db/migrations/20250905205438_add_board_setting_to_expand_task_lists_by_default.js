
exports.up = async (knex) => {
  await knex.schema.alterTable('board', (table) => {
    /* Columns */

    table.boolean('expand_task_lists_by_default').notNullable().defaultTo(false);
  });

  return knex.schema.alterTable('board', (table) => {
    table.boolean('expand_task_lists_by_default').notNullable().alter();
  });
};

exports.down = (knex) =>
  knex.schema.table('board', (table) => {
    table.dropColumn('expand_task_lists_by_default');
  });
