const Router = require('koa-router');
const passport = require('koa-passport');

const fs = require('fs');

const queries = require('../db/queries/users');
const helpers = require('./_helpers');

const router = new Router();

router.get('/auth/register', async (ctx) => {
  if(await helpers.ensureAdmin(ctx)){
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/register.html');
  } else {
    ctx.redirect('/auth/login');
    //ctx.redirect('back');
  }
});

router.post('/auth/register', async (ctx) => {
  if (await helpers.ensureAdmin(ctx)){
    const user = await queries.addUser(ctx.request.body);
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        ctx.login(user);
        ctx.redirect('/auth/status');
      } else {
        ctx.status = 400;
        ctx.body = { status: 'error' };
      }
    })(ctx);
  } else {
    ctx.redirect('/auth/status');
    //ctx.redirect('back');
  }
});

router.get('/auth/loginNotify', async (ctx) => {
  if (!helpers.ensureAuthenticated(ctx)) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/loginNotify.html');
  } else {
    ctx.redirect('/auth/status');
    //ctx.redirect('back');
  }
});

router.get('/auth/login', async (ctx) => {
  if (!helpers.ensureAuthenticated(ctx)) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/login.html');
  } else {
    ctx.redirect('/auth/status');
    //ctx.redirect('back');
  }
});

router.post('/auth/loginNotify', async (ctx) => {
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      ctx.status = 200;
      ctx.body = { id_user: `${helpers.getIdUser(ctx)}`};

      ctx.redirect('/api/v1/notification/pmh');
    } else {
      ctx.status = 401;
      ctx.body = { status: 'error' };
    }
  })(ctx);
});

router.post('/auth/login', async (ctx) => {
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      ctx.status = 200;
      ctx.body = { id_user: `${helpers.getIdUser(ctx)}`};

      /*if(ctx.session.from) {
        ctx.redirect(ctx.session.from);
      }else{
        ctx.redirect('/');
      }*/
      //ctx.redirect('/auth/status');
      //ctx.redirect(`/api/v1/measure/${helpers.getIdUser(ctx)}`);
    } else {
      ctx.status = 401;
      ctx.body = { status: 'error' };
    }
  })(ctx);
});

router.get('/auth/logout', async (ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {
    ctx.logout();
    //ctx.redirect('/auth/login');
    ctx.redirect(ctx.session.from);
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

router.get('/auth/status', async (ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {
    await ctx.render('status.html');
    //ctx.type = 'html';
    //ctx.body = fs.createReadStream('./src/server/views/status.html');
  } else {
    ctx.redirect('/auth/login');
  }
});

router.get('/auth/admin', async (ctx) => {
  if (await helpers.ensureAdmin(ctx)) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/server/views/admin.html');
  } else {
    ctx.redirect('/auth/login');
  }
});

router.put('/auth/regdevice', async(ctx) => {
  if (helpers.ensureAuthenticated(ctx)) {
    const user = await queries.updateDeviceId(helpers.getIdUser(ctx), ctx.request.body.device);
    ctx.redirect('/');
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

module.exports = router;
