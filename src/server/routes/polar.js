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
  ctx.redirect(`https://flow.polar.com/oauth2/authorization?response_type=code&client_id=${polar_config.client_id}`);
});

router.get('/callback/polar', async(ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {

    try {
      const user = await queries.getSingleUser(helpers.getIdUser(ctx));
      if (user.length) {
        ctx.body = {
          status: 'success',
          data: user
        };
        console.log(user.id_user);
      } else {
        ctx.status = 404;
        ctx.body = {
          status: 'error',
          message: 'That user has not exist.'
        };
      }
    } catch (err) {
      console.log(err)
    }



    console.log(ctx.request.query.code);
    var code = ctx.request.query.code;

    general_code = code;

    var creds = btoa(`${polar_config.client_id}:${polar_config.client_secret}`)
    
    const  dat = {
      'grant_type': 'authorization_code',
      'code': `${code}`,
    };
       
    var data = querystring.stringify(dat);
    var contentLength = dat.length;
    

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
      .then(json => {
        if(json !== undefined){
          console.log(json);
          accessToken = json.access_token;
          userid = json.x_user_id;
        
          polar_config.fetchUserInfo(accessToken, userid);
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
