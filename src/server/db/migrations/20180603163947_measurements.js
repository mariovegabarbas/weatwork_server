
exports.up = function(knex, Promise) {
	return knex.schema.createTable('measurements', function(table) {
		table.timestamp('tstamp').notNullable();
		table.string('type');
		table.string('position');
		table.string('sensor');
		table.float('value');
		table.integer('id_user').unsigned().notNullable();
		table.foreign('id_user').references('users.id');
		table.timestamp('real_tstamp').notNullable();
		table.string('work_cycle');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('measurements');
};

/* timestamp in knex is timestamptz in postgres */

/*

create extension if not exists timescaledb cascade;

create table measurements (
	tstamp timestamp without time  not null,
	type varchar(100),
	position varchar(150),
	sensor varchar(150),
	value real,
	id_user integer references users(id),
	real_tstamp timestamp without time zone not null
);

select create_hypertable('measurements', 'real_tstamp', 'tstamp');
*/
