const express = require('express');
const router = express.Router();
const db = require('../../mysql');
const { verifyTokenMiddle } = require("../../common/token.js")
const { bodyDealWith } = require('../../common/index.js')


var onLogin = {
	code: 1,
	msg: '未登录',
	data: []
}

// 自定义背景图片上传
router.post('/uploadBg', (req, res, next) =>{
	let params = req.body;
	verifyTokenMiddle(req, res, next, function(data) {
		let userId = data.info.userId;
		let field = ['*bh', 'userId', 'bs'];
	    let d = { 'bh': params.bh, 'userId':userId, 'bs':params.bs }
		bodyDealWith(field, d, function(data){
	    	sql = `INSERT INTO bg_picture(${data.name}) VALUES (${data.questionMark})`
	        db.query(sql, data.data, function(result, fields){
	        	sql = `SELECT * FROM file_table WHERE bh='${params.bh}'`
	        	db.query(sql, data.data, function(result, fields){
	        		res.send(result)
	        	})
	        })
	    })
	})
})


/**
* 查出所有的背景图进行展示
* 只查询level等于0的
*/
router.get('/queryBgPic', (req, res, next) =>{
	let sql = `SELECT * FROM bg_picture b,file_table f WHERE b.bh=f.bh AND b.level=0`;
	db.query(sql, [], function (result, fields) {
		res.send(result)
	})
})


/**
* 设置背景图
*/
router.post('/setBg', (req, res, next) =>{
	let params = req.body;
	verifyTokenMiddle(req, res, next, function(data) {
		let userId = data.info.userId;
		if(userId){
			let sql = `UPDATE user_specific SET bgImg='${params.bh || ''}' WHERE userId='${userId}'`
			db.query(sql, [], function(result, fields){
				let sql = `SELECT * FROM user_specific u, file_table f WHERE u.userId='${userId}' AND u.bgImg=f.bh`
				db.query(sql, [], function(result, fields){
					res.send(result)
				})
			})
		}else{
			res.json(onLogin)
		}
	})
})

module.exports = router;