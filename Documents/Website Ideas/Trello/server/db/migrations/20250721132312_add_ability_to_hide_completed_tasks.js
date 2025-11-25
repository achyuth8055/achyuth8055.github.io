
exports.up = async (knex) => {
  await knex.schema.alterTable('task_list', (table) => {
    /* Columns */

    table.boolean('hide_completed_tasks').notNullable().defaultTo(false);
  });

  return knex.schema.alterTable('task_list', (table) => {
    table.boolean('hide_completed_tasks').notNullable().alter();
  });
};

exports.down = (knex) =>
  knex.schema.table('task_list', (table) => {
    table.dropColumn('hide_completed_tasks');
  });
