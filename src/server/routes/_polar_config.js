const fetch = require('node-fetch');

const client_id = '3b9cac8a-2ffd-4e4d-96bc-318c8be3a791';
const client_secret = '846ccea5-0293-4d57-aaf4-c9d8b85b5ec0';

function fetchUserInfo(accessToken, userid) {
  return new Promise(function(resolve, reject){
    fetch('https://www.polaraccesslink.com/v3/users/'+userid, {
        method: 'GET',
        headers: {
          'Accept':'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(function(res) {
        if (res.status !== 200){
          console.log(res.status);
          return false;
        }else{
          console.log("res.json()");
          return res.json();
        }
      }).then(function(body) {
        if(!body){
          resolve("kein transaction fetching User Info.");
        }else{
          console.log(body);
          resolve(body);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
  
}

function registryUser(accessToken, userid, mockupId){
  return new Promise(function(resolve, reject){
    var inputBody = '<?xml version="1.0" encoding="utf-8" ?><register><member-id>userid_'+mockupId+'</member-id> </register>';
    fetch('https://www.polaraccesslink.com/v3/users', {
      method: 'POST',
      headers: {
        'Content-Type':'application/xml',
        'Accept':'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: inputBody
    }).then(function(res) {
        if (res.status !== 200){
          console.log(res.status);
          return false;
        }else{
          console.log("res.json()");
          return res.json();
        }
      }).then(function(body) {
        if(!body){
          resolve("kein transaction");
        }else{
          console.log(body);
          resolve(body);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
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

function getSleepInfo(accessToken, userid, transaction, activitiesId){
  return new Promise(function(resolve, reject){
    var responses = [];
    var reqCompleted = 0;
    var summaryExe = [];

    for(i in activitiesId){
      const idact = activitiesId[i][0];
      const date = activitiesId[i][2];
      fetch('https://www.polaraccesslink.com/v3/users/'+userid+'/activity-transactions/'+transaction+'/activities/'+activitiesId[i][0]+'/zone-samples', {
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
              
              var sleepTime = 0;
              var tmp = [];
              var s, act; 

              var regStrH = /[0-9]{1,2}H/;
              var regStrM = /[0-9]{1,2}M/;
              var regStrS = /[0-9]{1,2}S/;

              for(s in body['samples']){
                for(act in body['samples'][s]["activity-zones"]){
                  var aux = body['samples'][s]["activity-zones"][act];
                  /*if(aux["index"] == 0){
                    console.log("En fecha ["+summaryExec[i][2]+"] y zona "+aux["index"]+", con una duración de "+aux["inzone"]);
                    console.log(sleepTime);
                  }*/
                  switch(parseInt(aux["index"])){
                    case 0: {
                      if(aux["inzone"].match(regStrH) != null){
                        sleepTime = sleepTime + parseInt(aux["inzone"].match(regStrH)[0].split("H")[0])*3600;
                        //console.log(aux["inzone"].match(regStrH)[0].split("H")[0]);
                      }
                      if(aux["inzone"].match(regStrM) != null){
                        sleepTime = sleepTime + parseInt(aux["inzone"].match(regStrM)[0].split("M")[0])*60;
                        //console.log(aux["inzone"].match(regStrH));
                      }
                      if(aux["inzone"].match(regStrS) != null){
                        sleepTime = sleepTime + parseInt(aux["inzone"].match(regStrS)[0].split("S")[0]);
                        //console.log(aux["inzone"].match(regStrH));
                      }
                    }
                      break;
                    default:
                      break;
                  }
                }
              }
              tmp.push(idact);
              tmp.push(date);
              tmp.push(sleepTime);
              //tmp.push(responses[i]['samples']);
                  
              summaryExe.push(tmp);
              sleepTime = 0;
              //summaryExe.push(responses[i]["samples"]);
              //console.log(responses[i]["samples"]);
              

            }

            if(reqCompleted == activitiesId.length){
              resolve(summaryExe.sort(function(a,b){
                if(a[1]===b[1]){
                  return 0;
                }else{
                  return(a[1] < b[1] ? -1 : 1);
                }
              }));             
            }
          }).catch(err => {
            reject(err);
          });
    }
  });
}

/** Change the name of the function **/
function getActivitySummary(accessToken, userid, transaction, urls){
  return new Promise(function(resolve, reject){
    var responses = [];
    var reqCompleted = 0;

    for(i in urls){
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
              //console.log(reqCompleted);
            }

            console.log(reqCompleted);
            if(reqCompleted == urls.length){
              var summaryExe = [];
              for(i in responses){
                var tmp = [];

                /** Data structure of a Activity Summary
                {
                  "id": 1234,
                  "polar-user": "https://www.polaraccesslink/v3/users/1",
                  "transaction-id": 179879,
                  "date": "2010-12-31",
                  "created": "2016-04-27T20:11:33.000Z",
                  "calories": 2329,
                  "active-calories": 428,
                  "duration": "PT2H44M",
                  "active-steps": 250
                }
                **/

                tmp.push(responses[i].id);
                tmp.push(responses[i].created);
                tmp.push(responses[i].date);

                tmp.push(responses[i].calories);
                tmp.push(responses[i]['active-steps']);

                summaryExe.push(tmp);
              }

              /** Sorting by time-stamp and finally, date **/
              summaryExe.sort(function(a,b){
                if(a[1]===b[1]){
                  return 0;
                }else{
                  return(a[1] < b[1] ? -1 : 1);
                }
              }).sort(function(a,b){
                if(a[2]===b[2]){
                  return 0;
                }else{
                  return(a[2] < b[2] ? -1 : 1);
                }
              });

              /** Deleting redundant data **/
              var i, j, len=summaryExe.length-1;
              for(i=0, j=1; i < len; i++, j++){
                if(summaryExe[i][2]===summaryExe[j][2]){
                  summaryExe.splice(i,1);
                  i--; j--; len=summaryExe.length-1;
                }
              }

              resolve(summaryExe);
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
  getActivitySummary,
  getSleepInfo,
  registryUser
};