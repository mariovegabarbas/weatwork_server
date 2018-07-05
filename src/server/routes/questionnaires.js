const Router = require('koa-router');
const passport = require('koa-passport');
const fetch = require('node-fetch');

const fs = require('fs');

const helpers = require('./_helpers');

const queries = require('../db/queries/responses');

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
	          data: meas
	        };
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