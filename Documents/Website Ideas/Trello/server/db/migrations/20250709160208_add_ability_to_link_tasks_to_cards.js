
exports.up = async (knex) =>
  knex.schema.alterTable('task', (table) => {
    /* Columns */

    table.bigInteger('linked_card_id');

    /* Indexes */

    table.index('linked_card_id');
  });

exports.down = (knex) =>
  knex.schema.table('task', (table) => {
    table.dropColumn('linked_card_id');
  });
