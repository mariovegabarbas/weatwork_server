const Router = require('koa-router');
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'hello, We@Work world!'
  };
  //await ctx.render('index.html', {title: 'Mario es la leche'});
})

module.exports = router;
