const knex = require('../connection');

function getAllMeasures() {
  return knex('measurements')
  .select('*');
}

function getSingleMeasure(id) {
  return knex('measurements')
  .select('*')
  .where({ id_user: parseInt(id) });
}

function addMeasure(measure) {
  return knex('measurements')
  .insert(measure)
  .returning('*');
}

module.exports = {
	getAllMeasures,
	getSingleMeasure,
	addMeasure
};
