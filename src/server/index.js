const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const views = require('koa-views');

const indexRoutes = require('./routes/index');
const measRoutes = require('./routes/measurements');
const authRoutes = require('./routes/auth');
const polarRoutes = require('./routes/polar');
const notifyRoutes = require('./routes/notifications');
const questionRoutes = require('./routes/questionnaires');
const store = require('./session');

const app = new Koa();
const PORT = process.env.PORT || 8080;

// sessions
app.keys = ['super-secret-key'];
app.use(session({ store }, app));

// body parser
app.use(bodyParser());

// authentication
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

// views
app.use(views(__dirname + '/views', {
	map: {
		html: 'ejs'
	}
}));

// routes
app.use(indexRoutes.routes());
app.use(measRoutes.routes());
app.use(authRoutes.routes());
app.use(polarRoutes.routes());
app.use(notifyRoutes.routes());
app.use(questionRoutes.routes());


// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

require('./polarSchedule');

module.exports = server;
