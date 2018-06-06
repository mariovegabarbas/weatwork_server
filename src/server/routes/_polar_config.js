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

function createTransaction(accessToken, userid, kindoftrans){
  return new Promise(function(resolve, reject){
    fetch('https://www.polaraccesslink.com/v3/users/'+userid+'/'+kindoftrans+'-transactions', {
      method: 'POST',
      headers: {
        'Accept':'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(function(res) {
        if (res.status !== 201){
          return false;
        }else{
          return res.json();
        }
      }).then(function(body) {
        if(!body){
          resolve("kein transaction");
        }else{
          console.log(body);
          resolve(body["transaction-id"]);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

function getActivityInfo(accessToken, userid, transaction, activitiesId){
  return new Promise(function(resolve, reject){
    var responses = [];
    var reqCompleted = 0;

    for(i in activitiesId){
      fetch('https://www.polaraccesslink.com/v3/users/'+userid+'/activity-transactions/'+transaction+'/activities/'+activitiesId[i]+'/zone-samples', {
        method: 'GET',
        headers: {
          'Accept':'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(function(res){
        if (res.status !== 200){
            return false;
          }else{
            return res.json();
          }
        }).then(function(body){
            if(!body){
              console.log("no body at getActivityInfo");
              reject("kein transaction");
              reqCompleted++;
            }else{
              responses.push(body);
              reqCompleted++;
              console.log(reqCompleted);
            }

            console.log(reqCompleted);
            if(reqCompleted == activitiesId.length){
              var summaryExe = [];
              for(i in responses){
                /*var tmp = [];
                tmp.push(responses[i]['transaction-id']);
                tmp.push(responses[i]['start-time']);
                tmp.push(responses[i].id);*/

                summaryExe.push(responses[i]);

                resolve(summaryExe);
              }
            }
          }).catch(err => {
            reject(err);
          });
    }
  });
}

function getExerciceSummary(accessToken, userid, transaction, urls){
  return new Promise(function(resolve, reject){
    var responses = [];
    var reqCompleted = 0;

    console.log("info en getExerciceSummary::")
    console.log(urls.length);
    console.log(urls);
    console.log(urls[1]);

    for(i in urls){
      console.log(urls[i]);
      fetch(urls[i], {
        method: 'GET',
        headers: {
          'Accept':'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(function(res){
        if (res.status !== 200){
            return false;
          }else{
            return res.json();
          }
        }).then(function(body){
            if(!body){
              console.log("no body at getExerciceSummary");
              reject("kein transaction");
              reqCompleted++;
            }else{
              responses.push(body);
              reqCompleted++;
              console.log(reqCompleted);
            }

            console.log(reqCompleted);
            if(reqCompleted == urls.length){
              var summaryExe = [];
              for(i in responses){
                var tmp = [];
                tmp.push(responses[i]['transaction-id']);
                tmp.push(responses[i]['start-time']);
                tmp.push(responses[i].id);

                summaryExe.push(responses[i].id);

                resolve(summaryExe);
              }
            }
          }).catch(err => {
            reject(err);
          });
    }
  });
}

function listOfPerformance(accessToken, userid, transaction, performance){
  return new Promise(function(resolve, reject){
    fetch('https://www.polaraccesslink.com/v3/users/'+userid+'/'+performance+'-transactions/'+transaction, {
      method: 'GET',
      headers: {
        'Accept':'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(function(res) {
        if (res.status !== 200){
          return false;
        }else{
          return res.json();
        }
      }).then(function(body) {
        if(!body){
          console.log("no body at listOfPerformance");
          reject("kein transaction");
        }else{
          switch(performance){
            case 'exercise':
              resolve(body.exercises);
              break;
            case 'activity':
              resolve(body["activity-log"]);
              break;
            default:
              resolve(body["physical-informations"]);
          }
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = {
	client_secret,
	client_id,
	listOfPerformance,
  fetchUserInfo,
  createTransaction,
  getExerciceSummary,
  getActivityInfo
};