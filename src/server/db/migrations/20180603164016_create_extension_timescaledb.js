
exports.up = function(knex, Promise) {
	return knex.schema.raw("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE");
};

exports.down = function(knex, Promise) {
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