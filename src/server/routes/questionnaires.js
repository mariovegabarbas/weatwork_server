const Router = require('koa-router');
const passport = require('koa-passport');
const fetch = require('node-fetch');

const fs = require('fs');

const helpers = require('./_helpers');

const queries = require('../db/queries/responses');
const uqueries = require('../db/queries/users');

const router = new Router();
const BASE_URL = `/api/v1/questionnaire`;


router.get(BASE_URL, async (ctx) =>{
	if (helpers.ensureAuthenticated(ctx)) {
    	try {
      		const resp = await queries.getAllResponses();
      		ctx.body = resp;
      		ctx.status = 200;
	    } catch (err) {
	      console.log(err)
	    }
	} else {
		ctx.redirect('/auth/login');
	}
});

router.post(BASE_URL, async (ctx) =>{
	if (helpers.ensureAuthenticated(ctx)) {
	    try {
	      	const meas = await queries.addResponse(ctx.request.body);
	      	if (meas.length) {
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
		        ctx.status = 400;
		        ctx.body = {
		          status: 'error',
		          message: 'Something went wrong.'
		        };
		      }
	    } catch (err) {
	      ctx.status = 400;
	      ctx.body = {
	        status: 'error',
	        message: err.message || 'Sorry, an error has occurred.'
	      };
	    }
	} else {
	    ctx.status = 400;
	    ctx.redirect('/auth/login');
	}
});

module.exports = router;