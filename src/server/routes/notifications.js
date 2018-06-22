const Router = require('koa-router');
const passport = require('koa-passport');
const fs = require('fs');

const helpers = require('./_helpers');

const queries = require('../db/queries/measures');

const router = new Router();
const BASE_URL = `/api/v1/notification`;

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

/*router.get(`${BASE_URL}/mph`, async (ctx) =>{
	if (helpers.ensureAuthenticated(ctx)) {
    	try {
      		fetch('http://192.168.43.116:8080/api/send', {
				method: 'POST',
			    headers: {
			    	'Content-Type': 'application/json',
			    },
			    body: "{'title': 'title test', 'body': 'Hej Hej!', 'user': 'nexus-pocket-waw'}"
			})*/
			  /** Inspect this section **//*
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
});*/

module.exports = router;