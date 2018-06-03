const bcrypt = require('bcryptjs');
const knex = require('../connection');

function getSingleUser(id) {
  return knex('users')
  .select('*')
  .where({ id: parseInt(id) });
}

function addUser(user) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(user.password, salt);
  return knex('users')
  .insert({
    id: user.id,
    username: user.username,
    password: hash,
  })
  .returning('*');
}

function updatePolarInfo(id, at, ui){
  return knex('users')
  .update({
    accesstoken: at,
    userid: ui
  })
  .where({ id: parseInt(id) })
  .returning('*');
}

module.exports = {
  getSingleUser,
  addUser,
  updatePolarInfo
};
