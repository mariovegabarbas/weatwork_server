const Router = require('koa-router');
const passport = require('koa-passport');
const fetch = require('node-fetch');

const fs = require('fs');
const querystring = require('querystring');
const btoa = require('btoa');

const queries = require('../db/queries/users');
const helpers = require('./_helpers');
const polar_config = require('./_polar_config');

const router = new Router();

var general_code;
var accessToken;
var userid;

router.get('/auth/polar', async(ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {
    /** Checking if is logged in **/
    try {
      const user = await queries.getSingleUser(helpers.getIdUser(ctx));
      if (user.length) {
        ctx.body = {
          status: 'success',
          data: user
        };
        console.log("In /auth/polar:User Id: "+user[0].id);
        console.log("In /auth/polar:From: "+ctx.request.url);
        ctx.redirect(`https://flow.polar.com/oauth2/authorization?response_type=code&client_id=${polar_config.client_id}`);
      } else {
        ctx.status = 404;
        ctx.body = {
          status: 'error',
          message: 'That user does not exist.'
        };
      }
    } catch (err) {
      console.log(err)
    }
  }else{
    ctx.redirect('/auth/login');
  }
});

router.get('/callback/polar', async(ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {

    /** Checking if is logged in **/
    try {
      const user = await queries.getSingleUser(helpers.getIdUser(ctx));
      if (user.length) {
        ctx.body = {
          status: 'success',
          data: user
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          status: 'error',
          message: 'That user does not exist.'
        };
      }
    } catch (err) {
      console.log(err)
    }


    /** Taking the Polar initial transaction code **/
    var code = ctx.request.query.code;
    general_code = code;

    /** Credentials **/
    var creds = btoa(`${polar_config.client_id}:${polar_config.client_secret}`)
    
    const  dat = {
      'grant_type': 'authorization_code',
      'code': `${code}`,
    };
       
    var data = querystring.stringify(dat);
    var contentLength = dat.length;
    

/** Getting tokens, the user is registry in AccessLink **/
    fetch('https://polarremote.com/v2/oauth2/token', {
      headers: {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept':'application/json; charset=utf-8',
        'Authorization':`Basic ${creds}`
      },
      body: data,
      method: 'POST'
    })
      .then(res => {
        if (res.status !== 200){
          console.log(res.status);
        }else{
          return res.json();
        }
      })
      .then(async function(json){
        if(json !== undefined){
          console.log(json);
          accessToken = json.access_token;
          userid = json.x_user_id;
        
          const userInfo = await polar_config.fetchUserInfo(accessToken, userid);
          console.log(userInfo);
          const user = await queries.updatePolarInfo(helpers.getIdUser(ctx), accessToken, userid);

          return true;

        } else {
          return false;
        }
        
      })
      .catch(err => console.log(err));
    /*
    var options = {
      uri: 'https://polarremote.com/v2/oauth2/token',
      headers: {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept':'application/json; charset=utf-8',
        'Authorization':`Basic ${creds}`
      },
      body: data,
      method: 'POST'
    };
    request(options, function(err, res, body){
      if(err||res.statusCode !== 200){
        console.log(err);
      }else{
        var accessToken = JSON.parse(body).access_token;
        var userid = JSON.parse(body).x_user_id;
        
        fetch('https://www.polaraccesslink.com/v3/users/'+userid, {
          method: 'GET',
          headers: {
            'Accept':'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        })
          .then(res => res.json())
          .then(json => console.log(json));
        console.log(JSON.parse(body));
        var accessToken = JSON.parse(body).access_token;
        var userid = JSON.parse(body).x_user_id;
        var xml= '<?xml version="1.0" encoding="utf-8" ?><register><member-id>userid_0001</member-id> </register>';
        var options2 = {
          uri: 'https://www.polaraccesslink.com/v3/users',
          headers: {
            'Content-Type':'application/xml',
            'Accept':'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: xml,
          method: 'POST'
        };

        request(options2, function(err, res, body){
          if(err){
            console.log(err);
          }else{
            console.log(JSON.parse(body))
          }
        });
      }
    });*/
  }else{
    ctx.redirect('/auth/login');
  }
});

router.get('/polar/user/:id', async (ctx) => {
  polar_config.fetchUserInfo(accessToken, ctx.params.id);
});

router.get('/polar/register/:id', async (ctx) => {
  const user = await queries.getSingleUser(helpers.getIdUser(ctx));
  const accTkn = user[0].accesstoken;
  const userid = user[0].userid;
  const userRegistered = await polar_config.registryUser(accTkn, userid, ctx.params.id);

  console.log(userRegistered);
});

router.get('/testing', async (ctx) => {
  console.log("hola!");
  var auxTest = [{"activity-zones":[{"index":0,"inzone":"PT1H"},{"index":1,"inzone":"PT0S"},{"index":2,"inzone":"PT0S"},{"index":3,"inzone":"PT0S"},{"index":4,"inzone":"PT0S"},{"index":5,"inzone":"PT0S"}],"time":"00:00:00.000"},{"activity-zones":[{"index":0,"inzone":"PT1H"},{"index":1,"inzone":"PT0S"},{"index":2,"inzone":"PT0S"},{"index":3,"inzone":"PT0S"},{"index":4,"inzone":"PT0S"},{"index":5,"inzone":"PT0S"}],"time":"01:00:00.000"},{"activity-zones":[{"index":0,"inzone":"PT1H"},{"index":1,"inzone":"PT0S"},{"index":2,"inzone":"PT0S"},{"index":3,"inzone":"PT0S"},{"index":4,"inzone":"PT0S"},{"index":5,"inzone":"PT0S"}],"time":"02:00:00.000"},{"activity-zones":[{"index":0,"inzone":"PT1H"},{"index":1,"inzone":"PT0S"},{"index":2,"inzone":"PT0S"},{"index":3,"inzone":"PT0S"},{"index":4,"inzone":"PT0S"},{"index":5,"inzone":"PT0S"}],"time":"03:00:00.000"},{"activity-zones":[{"index":0,"inzone":"PT59M"},{"index":1,"inzone":"PT0S"},{"index":2,"inzone":"PT1M"},{"index":3,"inzone":"PT0S"},{"index":4,"inzone":"PT0S"},{"index":5,"inzone":"PT0S"}],"time":"04:00:00.000"},{"activity-zones":[{"index":0,"inzone":"PT1H"},{"index":1,"inzone":"PT0S"},{"index":2,"inzone":"PT0S"},{"index":3,"inzone":"PT0S"},{"index":4,"inzone":"PT0S"},{"index":5,"inzone":"PT0S"}],"time":"05:00:00.000"},{"activity-zones":[{"index":0,"inzone":"PT1H"},{"index":1,"inzone":"PT0S"},{"index":2,"inzone":"PT0S"},{"index":3,"inzone":"PT0S"},{"index":4,"inzone":"PT0S"},{"index":5,"inzone":"PT0S"}],"time":"06:00:00.000"}];
  for(i in auxTest){
    for(j in auxTest[i]["activity-zones"])
    console.log(auxTest[i]["activity-zones"][j]["inzone"]);
  }

  var testString = "PT2H5M43S";
  
  var regStrH = /[0-9]{1,2}H/;
  var regStrM = /[0-9]{1,2}M/;
  var regStrS = /[0-9]{1,2}S/;

  console.log(regStrM.exec(testString));

  var resultH = parseInt(testString.match(regStrH)[0].split("H")[0]);
  var resultM = parseInt(testString.match(regStrM)[0].split("M")[0]);
  var resultS = parseInt(testString.match(regStrS)[0].split("S")[0]);
  resultH = resultH + 1;
  console.log(resultH);

  var arrayX = [[2,2,1],[4,3,1],[3,4,4],[3,5,4],[3,6,4],[3,4,5],[3,5,5],[3,4,6],[3,1,7],[3,4,7]];
  console.log(arrayX);
  var i, j, len=arrayX.length-1;
  for(i=0, j=1; i < len; i++, j++){
    console.log("la i: "+arrayX[i][2]);
    console.log("la j: "+arrayX[j][2]);
    if(arrayX[i][2]===arrayX[j][2]){
      arrayX.splice(i,1);
      i--; j--; len=arrayX.length-1;
    }
    
  }
  console.log(arrayX);
});

router.get('/polar/listOf/:performance', async (ctx) =>{
  if (helpers.ensureAuthenticated(ctx)) {
    const id = helpers.getIdUser(ctx);
    const performance = ctx.params.performance;
    /** If we need any kind of data **/
    //var re = /^(exercise|activity|physical-information)$/;
    
    /** If we only need activity **/
    var re = /^activity$/;


    if(re.test(performance)){
      const user = await queries.getSingleUser(id);
      const accTkn = user[0].accesstoken;
      const userid = user[0].userid;

      console.log(accTkn);
      console.log(userid);
      const transactionId = await polar_config.createTransaction(accTkn, userid, performance);
      console.log(transactionId);
      const listOf = await polar_config.listOfPerformance(accTkn, userid, transactionId, performance);
      const summaryExec = await polar_config.getActivitySummary(accTkn, userid, transactionId, listOf);
      //const summaryExec = [ [ 222380079, '2018-06-04T19:45:52.000', '2018-03-25' ], [ 222380084, '2018-06-04T19:45:54.000', '2018-03-27' ], [ 222380087, '2018-06-04T19:45:55.000', '2018-03-28' ], [ 222380089, '2018-06-04T19:45:55.000', '2018-03-29' ], [ 222380094, '2018-06-04T19:45:56.000', '2018-03-30' ], [ 222380097, '2018-06-04T19:45:56.000', '2018-04-01' ], [ 222380099, '2018-06-04T19:45:57.000', '2018-04-03' ], [ 222771420, '2018-06-06T13:48:09.000', '2018-06-04' ], [ 222771426, '2018-06-06T13:48:12.000', '2018-06-05' ], [ 223054855, '2018-06-07T19:29:46.000', '2018-06-06' ], [ 223054854, '2018-06-07T19:29:46.000', '2018-06-07' ], [ 223219727, '2018-06-08T14:56:21.000', '2018-06-08' ] ];

      const sleepInfo = await polar_config.getSleepInfo(accTkn, userid, transactionId, summaryExec);


      
      for(a in sleepInfo){
        console.log("Total Sleep Time (in seconds) registered for activity "+sleepInfo[a][0]+" to "+sleepInfo[a][1]+": "+sleepInfo[a][2]);
      }

      const insert = await polar_config.addActivityPolarData(sleepInfo, summaryExec, id);
      console.log(insert);

      ctx.status = 200;
      ctx.body = {
        status: 'OK',
        data: summaryExec
      };
    }else{
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That performance couldn\'t be done!.'
      };
    }
  }else{
    ctx.redirect('/auth/login');
  }
});

router.get('/polar/mockupAdding', async(ctx) =>{
  if (helpers.ensureAuthenticated(ctx)) {
    const id = helpers.getIdUser(ctx);
    
    const a = b = [];

    const insert = await polar_config.mockupAddActivityPolarData(a, b, id);


      console.log(insert);
  }else{
    ctx.redirect('/auth/login');
  }


});

router.get('/polar/notifications', async (ctx) => {

  /** Credentials **/
  var creds = btoa(`${polar_config.client_id}:${polar_config.client_secret}`);
  
  fetch('https://www.polaraccesslink.com/v3/notifications', {
        method: 'GET',
        headers: {
          'Accept':'application/json',
          'Authorization':`Basic ${creds}`
        }
  })
  /** Inspect this section **/
  .then(function(res) {
      if (res.status !== 200){
          console.log(res.status);
          return null;
      }else{
          return res.json();
      }
    })
    .then(function(body) {
        console.log(body);
      }).catch(function(err){
        console.log(err);
      });

});

router.get('/polar/user', async (ctx) =>{
  
  var creds = btoa(`${polar_config.client_id}:${polar_config.client_secret}`)
  
  const  dat = {
    'grant_type': 'authorization_code',
    'code': `${general_code}`,
  };
     
  var data = querystring.stringify(dat);
  var contentLength = dat.length;
  var options = {
    uri: 'https://polarremote.com/v2/oauth2/token',
    headers: {
      'Content-Length': contentLength,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept':'application/json; charset=utf-8',
      'Authorization':`Basic ${creds}`
    },
    body: data,
    method: 'POST'
  };

  request(options, function(err, res, body){
    if(err||res.statusCode !== 200){
      console.log(err);
    }else{
      console.log(JSON.parse(body));
      var accessToken = JSON.parse(body).access_token;
      var userid = JSON.parse(body).x_user_id;
      var options2 = {
        uri: 'https://www.polaraccesslink.com/v3/users/'+userid,
        headers: {
          'Accept':'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'GET'
      };

      request(options2, function(err, res, body){
        if(err){
          console.log(err);
        }else{
          console.log(JSON.parse(body))
        }
      });
    }
  });
});

module.exports = router;
