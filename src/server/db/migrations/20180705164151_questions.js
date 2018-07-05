
exports.up = function(knex, Promise) {
	return knex.schema.createTable('qresponses', function(table) {
		table.integer('id_response').notNullable();
		table.integer('id_user').unsigned().notNullable();
		table.foreign('id_user').references('users.id');
		table.timestamp('response_tstamp').notNullable();
		table.string('responses');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('qresponses');
};
