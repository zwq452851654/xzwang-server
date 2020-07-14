var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../mysql');
var jwt = require('jsonwebtoken');

router.get('/islogin', (req, res, next) => {
	var params = url.parse(req.url, true).query;
	if(params.token){
		jwt.verify(params.token, 'keven', function(err, decoded) { // decoded:指的是tokneid解码后用户信息
			if (err) {
				res.send({code:0, msg:"登录信息验证失败", data:[]})
			} else {
				let sql = `SELECT * FROM user_info WHERE account='${params.account}'`
				db.query(sql, [],function(result,fields){
					res.json(result);
				});
			}
		})
	}else{
		res.send({code:0, msg:"未登录请先登录", data:[]})
	}
	
});

module.exports = router;
