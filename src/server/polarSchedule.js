const fetch = require('node-fetch');
const queries = require('./db/queries/users');
const schedule = require('node-schedule');

const fs = require('fs');
const querystring = require('querystring');
const btoa = require('btoa');

const helpers = require('./routes/_helpers');
const polar_config = require('./routes/_polar_config');

var general_code;
var accessToken;
var userid;
 
var j = schedule.scheduleJob('3 * * *', async() => {
	const users = await queries.getAllUsers();
	const performance = 'activity';

	for(var i = 0, len = users.length; i < len; i++){
		if(users[i].userid != null){
			console.log(users[i].userid);

			var id = users[i].id;
			var accTkn = users[i].accesstoken;
		    var userid = users[i].userid;

		    try {

			    const transactionId = await polar_config.createTransaction(accTkn, userid, performance);
			    const listOf = await polar_config.listOfPerformance(accTkn, userid, transactionId, performance);
			    const summaryExec = await polar_config.getActivitySummary(accTkn, userid, transactionId, listOf);
			    const sleepInfo = await polar_config.getSleepInfo(accTkn, userid, transactionId, summaryExec);

			    console.log("TO HERE OK!");
			    console.log(summaryExec);
			    const insert = await polar_config.addActivityPolarData(sleepInfo, summaryExec, id);
			    console.log("TO HERE OK!");
			    console.log(insert);

			    console.log('commiting data');
			    const commit = await polar_config.fetchCommit(accTkn, userid);
			    console.log('data commited');
			}catch (err) {
				console.log(err);
			}
		}
	}
});



