var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../mysql');
var { bodyDealWith, createUUID } = require('../common');
var jwt = require('jsonwebtoken');
var request = require('request');



/**
 * 微信用户登录,在获取到openid后查询user_account表看是否存有该openid，如果没有就做一个保存动作
 */
router.get('/queryLoginInfo', (req, res, next) => {
	let params = req.query;
	let appid = "wxfd2e2987e441ae05";
	let secret = "4a0508291bfdba99a799ceb46170b80e";
	let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${params.code}&grant_type=authorization_code`
	// 向微信发送登录状态查询
	request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
			var data = JSON.parse(body);
			// 拿到返回值先查询user_account表是否有该用户
			let sql = `SELECT * FROM user_account WHERE openid='${data.openid}'`
			db.query(sql, [],function(result,fields){
				var tokenid = jwt.sign(data, 'keven', {
					expiresIn: 60*60*1
				});
				result.token = tokenid;
				result.msg = '登录成功';
				if(result.data.length > 0){
					// 如果有就正常返回token
					result.data = [];
					res.json(result);
				}else{
					// 如果没有就先保存用户信息，后正常返回token
					let field = ['userBh', 'account', 'pass', 'openid'];
					params.userBh = createUUID();
					params.openid = data.openid;
					bodyDealWith(field, params, function(data){
						if(data.code){
							sql = `INSERT INTO user_account(${data.name}) VALUES(${data.questionMark})`;
							db.query(sql, data.data, function(result,fields){
								result.token = tokenid;
								result.msg = '登录成功';
								result.data = [];
								res.json(result);
							});
						}else{
							res.json({
								code: data.code,
								msg: data.msg
							});
						}
					});
				}
			})
        } else {
            res.send('{error:404}');
        }
    });
});


/**
 * H5用户登录，根据account、pass
 */
router.post('/login', (req, res, next) => {
	let params = req.body;
	let sql = `SELECT * FROM user_account WHERE account='${params.account}' && pass='${params.pass}'`
	db.query(sql, [],function(result,fields){
		if(result.data.length > 0){
			var tokenid = jwt.sign(params, 'keven', {
                expiresIn: 60*60*1
			});
			result.token = tokenid;
			result.msg = '登录成功';
			result.data = [];
			res.json(result);
		}else{
			sql = `SELECT * FROM user_account WHERE account='${params.account}'`
			db.query(sql, [],function(result,fields){
				result.code = 0;
				if(result.data.length > 0){
					result.msg = '用户名或密码错误';
				}else{
					result.msg = '输入账号未注册，请确认';
				}
				res.json(result);
			})
		}
	});
});


/**
 * H5注册用户
 */
router.post('/reg', (req, res, next) => {
	let params = req.body;
	let field = ['userBh', 'account', 'pass', 'openid'];
	let sql = `SELECT * FROM user_account WHERE account='${params.account}'`;
	db.query(sql, [], function(result,fields){
		if(result.data.length > 0){
			result.code = 0;
			result.msg = '用户账号已存在';
			result.data = [];
			res.json(result);
		}else{
			params.userBh = createUUID();
			bodyDealWith(field, params, function(data){
				if(data.code){
					sql = `INSERT INTO user_account(${data.name}) VALUES(${data.questionMark})`;
					db.query(sql, data.data, function(result,fields){
						result.data = [];
						res.json(result);
					});
				}else{
					res.json({
						code: data.code,
						msg: data.msg
					});
				}
			});
		}
	});
});

module.exports = router;
