const Router = require('koa-router');
const passport = require('koa-passport');
const fetch = require('node-fetch');

const fs = require('fs');

const helpers = require('./_helpers');
const analytics = require('./_analytics');

const queries = require('../db/queries/measures');
const uqueries = require('../db/queries/users');

const router = new Router();
const BASE_URL = `/api/v1/notification`;

router.get(`${BASE_URL}/pmh/:msg`, async (ctx) =>{
	if (helpers.ensureAuthenticated(ctx)) {
		ctx.status = 201;
	    ctx.body = {
	        status: 'success',
	        data: "OK"
	    };
    	
    	try {
    		const user = await uqueries.getSingleUser(helpers.getIdUser(ctx));
      		fetch('http://notifier.weatwork.eu:8080/api/send', {
      		//fetch('http://localhost:8080/api/send', {
				method: 'POST',
			    headers: {
			        'Content-Type': 'application/json'
			    },
			    //user must be the idDevice stored in the Users table
			    body: JSON.stringify({body: `${ctx.params.msg}`, title: "WeAtWork App", user: `${user[0].deviceid}`})
			})
			  /** Inspect this section **/
			  .then(function(res) {
			      if (res.status !== 200){
			          console.log("I ve sent a msg to pmh: "+ctx.params.msg+" and the status is: "+res.status);
			          return null;
			      }else{
			      	console.log(res.status);
			      	return true;
			      }
			    });
	    } catch (err) {
	      console.log(err);
	      ctx.status = 401;
      	  ctx.body = { status: 'error' };
	    }
	} else {
		ctx.redirect('/auth/login');
	}
});

router.get(`${BASE_URL}/pmh`, async (ctx) =>{
	if (helpers.ensureAuthenticated(ctx)) {
		ctx.status = 200;
      	ctx.body = { id_user: `${helpers.getIdUser(ctx)}`};

    	try {
    		const user = await uqueries.getSingleUser(helpers.getIdUser(ctx));
    		const analMSG = await analytics.stressEnergyAnalytics(helpers.getIdUser(ctx));

      		fetch('http://notifier.weatwork.eu:8080/api/send', {
      		//fetch('http://localhost:8080/api/send', {
				method: 'POST',
			    headers: {
			        'Content-Type': 'application/json'
			    },
			    //user must be the idDevice stored in the Users table
			    body: JSON.stringify({body: `${analMSG}`, title: "WeAtWork App", user: `${user[0].deviceid}`})
			})
			  /** Inspect this section **/
			  .then(function(res) {
			      if (res.status !== 200){
			          console.log(res.status);
			          return null;
			      }else{
			      	console.log(res.status);
			      	return true;
			      }
			    });
	    } catch (err) {
	      console.log(err);
	      ctx.status = 401;
      	  ctx.body = { status: 'error' };
	    }
	} else {
		ctx.redirect('/auth/login');
	}
});

router.get(`${BASE_URL}/:date`, async (ctx) =>{
	if (helpers.ensureAuthenticated(ctx)) {
    	try {
      		const meas = await queries.getSinglePolarInfo(helpers.getIdUser(ctx), ctx.params.date);
      		var aux = [];
  			var tmp;
      		for(i in meas){
      			tmp = { date: ''+meas[i]['real_tstamp']+'', type: ''+meas[i]['type']+'', value: ''+meas[i]['value'] };
      			aux.push(tmp);
      		}
      		ctx.body = {
      			id_user: helpers.getIdUser(ctx),
        		title: `Polar Notification since ${ctx.params.date}`,
        		message: aux
      		};
	    } catch (err) {
	      console.log(err)
	    }
	} else {
		ctx.redirect('/auth/login');
	}
});

router.get(BASE_URL, async (ctx) =>{
	if (helpers.ensureAuthenticated(ctx)) {
    	try {
      		const meas = await queries.getAllPolarInfo(helpers.getIdUser(ctx), ctx.params.date);

      		var aux = [];
  			var tmp;
      		for(i in meas){
      			tmp = { date: ''+meas[i]['real_tstamp']+'', type: ''+meas[i]['type']+'', value: ''+meas[i]['value'] };
      			aux.push(tmp);
      		}
      		ctx.body = {
      			id_user: helpers.getIdUser(ctx),
        		title: `Polar Notification for all sensing period`,
        		message: aux
      		};
	    } catch (err) {
	      console.log(err)
	    }
	} else {
		ctx.redirect('/auth/login');
	}
});



router.post('/api/send', async (ctx) =>{
	console.log(ctx.request.body);
	if (helpers.ensureAuthenticated(ctx)) {
    	try {
    		ctx.status = 269;
      		console.log(ctx.request.body);
      		ctx.body = ctx.request.body;
	    } catch (err) {
	      console.log(err)
	    }
	} else {
		ctx.redirect('/auth/login');
	}
});

module.exports = router;