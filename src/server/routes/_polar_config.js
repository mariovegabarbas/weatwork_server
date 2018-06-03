const fetch = require('node-fetch');

const client_id = '3b9cac8a-2ffd-4e4d-96bc-318c8be3a791';
const client_secret = '846ccea5-0293-4d57-aaf4-c9d8b85b5ec0';

function fetchUserInfo(accessToken, userid) {
  fetch('https://www.polaraccesslink.com/v3/users/'+userid, {
        method: 'GET',
        headers: {
          'Accept':'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(json => console.log(json));
}

module.exports = {
	client_secret,
	client_id,
	fetchUserInfo
};