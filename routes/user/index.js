var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../../mysql');

var { bodyDealWith } = require('../../common');


router.post('/reg', (req, res, next) =>{
	console.log('==', req.body);
	req.body.userId = '123456'
	let field = ['userId','phone','email','account','pass','openId']
	bodyDealWith(field, req.body, function(data){
		console.log(data)
		sql = `INSERT INTO ${table_name}(${data.name}) VALUES (${data.questionMark}) `
		db.query(sql, [data], function(result,fields){
			result.data = [];
		});
	})
	
})

module.exports = router;