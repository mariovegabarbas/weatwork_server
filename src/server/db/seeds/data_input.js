const bcrypt = require('bcryptjs');
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('measurements').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').del()
        .then(function () {
          const salt1 = bcrypt.genSaltSync();
          const hash1 = bcrypt.hashSync('vegabarbas', salt1);
          const salt2 = bcrypt.genSaltSync();
          const hash2 = bcrypt.hashSync('comunist', salt2);
          return knex('users').insert([
          {
            id: 1, 
            username: 'mario',
            password: hash1,
            admin: false
          },
          {
            id: 2, 
            username: 'theRealParty',
            password: hash2,
            admin: true
          }
          ]);
        })
        .then(function () {
          return knex('measurements').insert([
              {tstamp: '2018-05-05 13:04:55.463487+02', type: 'HH', position: 'left hand', sensor: 'polar brlt', value: 120.5, id_user: 1, real_tstamp: '2018-05-02 13:04:55.463487+02'},
              {tstamp: '2018-05-05 13:05:26.444771+02', type: 'HH', position: 'left hand', sensor: 'polar brlt', value: 123.0, id_user: 1, real_tstamp: '2018-05-02 13:05:55.463487+02'},
              {tstamp: '2018-05-05 13:05:39.137745+02', type: 'HH', position: 'left hand', sensor: 'polar brlt', value: 143.5, id_user: 1, real_tstamp: '2018-05-02 13:14:55.463487+02'},
          ]);
        });
    });
};