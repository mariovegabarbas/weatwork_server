const knex = require('../connection');

function getAllResponses() {
  return knex('qresponses')
  .select('*');
}

function getLastStress(id) {
  return knex('qresponses')
  .select('responses')
  .where({  id_user: parseInt(id) })
  .orderBy('id_response', 'DESC')
  .limit(1);
}

function getResponsesFor(id) {
  return knex('qresponses')
  .select('*')
  .where({ id_user: parseInt(id) });
}

function addResponse(response) {
  return knex('qresponses')
  .insert(response)
  .returning('*');
}

module.exports = {
	getAllResponses,
	getResponsesFor,
	addResponse,
  getLastStress
};
