const Router = require('koa-router');
const router = new Router();

const helpers = require('./_helpers');
const queries = require('../db/queries/users');

const PORT = process.env.PORT || 1337;

router.get('/', async (ctx) => {
	try{
		ctx.session.from = '/';
		ctx.status = 200;
		/*ctx.body = {
			status: 'success',
			message: 'hello, We@Work world!'
		};*/

		if (helpers.ensureAuthenticated(ctx)) {
			const user =  await queries.getSingleUser(helpers.getIdUser(ctx));
			await ctx.render('index.html', {user_name: `${user[0].username}`, port: `${PORT}`, login: 'false'});
		}else{
			await ctx.render('index.html', {user_name: '', port: `${PORT}`, login: 'true'});
		}
	} catch (err) {
      console.log(err);
      ctx.status = 500;
      ctx.body = {
      	status: 'Error',
      	message: err
      };
    }
})

module.exports = router;
