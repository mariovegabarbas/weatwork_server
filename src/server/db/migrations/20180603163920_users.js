exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.string('accesstoken').unique();
    table.string('userid').unique();

    /* To review and add to the sytem: This token has to be used 
    to sent notifications to the user mobile */
    //table.string('mphtoke').unique();
    
    table.boolean('admin').notNullable().defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};

