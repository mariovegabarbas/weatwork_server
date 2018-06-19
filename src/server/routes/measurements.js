const Router = require('koa-router');
const passport = require('koa-passport');
const fs = require('fs');

const helpers = require('./_helpers');

const queries = require('../db/queries/measures');

const router = new Router();
const BASE_URL = `/api/v1/measure`;
const BASE_URL2 = `/api/v2/measure`;

router.get(BASE_URL, async (ctx) => {
  /* Solo si es admin */
  if (helpers.ensureAuthenticated(ctx)) {
    try {
      const meas = await queries.getAllMeasures();
      ctx.body = {
        status: 'success',
        data: meas
      };
    } catch (err) {
      console.log(err)
    }
  } else {
    ctx.redirect('/auth/status');
  }
});

/*router.get('/auth/status', async (ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/status.html');
  } else {
    ctx.redirect('/auth/login');
  }
});*/

router.get(`${BASE_URL}/:id`, async (ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {
    try {
      const meas = await queries.getSingleMeasure(ctx.params.id);
      if (meas.length) {
        ctx.body = {
          status: 'success',
          data: meas
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          status: 'error',
          message: 'That user has not measurements.'
        };
      }
    } catch (err) {
      console.log(err)
    }
  } else {
    ctx.redirect('/auth/login');
  }
});

router.post(`${BASE_URL}`, async (ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {
    try {
      console.log(ctx.request.body);
      const meas = await queries.addMeasure(ctx.request.body);
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

/* Review to delete this part */
router.post(`${BASE_URL2}`, async (ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {
    try {
      console.log(ctx.request.body);
      var aux = body.split("#");
      for(i in aux){
        
      }
      const meas = await queries.addMeasure(ctx.request.body);
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
    ctx.redirect('/auth/login');
  }
});

module.exports = router;
