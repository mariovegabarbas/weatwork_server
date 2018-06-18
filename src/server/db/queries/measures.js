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

function getSinglePolarInfo(id, date) {
  return knex('measurements')
  .select('type', 'value', 'real_tstamp')
  .whereIn('type', ['Sleep Time', 'Calories', 'Active-steps'])
  .andWhere('real_tstamp', '>', date)
  .andWhere({ id_user: parseInt(id) });
}

function getAllPolarInfo(id) {
  return knex('measurements')
  .select('type', 'value', 'real_tstamp')
  .whereIn('type', ['Sleep Time', 'Calories', 'Active-steps'])
  .andWhere({ id_user: parseInt(id) });
}

module.exports = {
	getAllMeasures,
	getSingleMeasure,
	addMeasure,
  getSinglePolarInfo,
  getAllPolarInfo
};
