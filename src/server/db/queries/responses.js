const knex = require('../connection');

function getAllResponses() {
  return knex('qresponses')
  .select('*');
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
};
