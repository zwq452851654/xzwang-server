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


function createId(){
	let time = new Date().getTime() + '';
	let m,str="BZX";
	for(let i=0; i<5; i++){
		m = Math.random()*time.length
		str += time.slice(m, ++m);
	}
	return str
}

/**
 * 网址类型标准项查询
 * 
*/
router.get('/queryWebType', (req, res, next) =>{
	verifyTokenMiddle(req, res, next, function(data) {
		let userId = data.info.userId;
		if(!userId) res.json(onLogin)
		let level = data.info.level;
		if(level >= 2){
			let sql = `SELECT * FROM bzx_web_type`;
			db.query(sql, [], function(result, fields){
				res.send(result)
			})
		}else{
			res.json({
				code: 0,
				msg: "该账号无访问权限"
			})
		}
	})

	
})



/**
 * 标准项维护（有传bh就是修改，没传bh就是新增）
 * @param {string} bh: 有传bh就是修改，没传bh就是新
 * 
*/


router.post('/editBzx', (req, res, next) =>{
	let params = req.body;
	verifyTokenMiddle(req, res, next, function(data) {
		let userId = data.info.userId;
		if(userId == "") res.json(onLogin);
		let level = data.info.level;
		let sql;
		if(level >= 2){
			sql = `SELECT * FROM bzx_web_type WHERE bzbh='${params.bzbh}' OR bzmc='${params.bzmc}'`;
			// 1、先查询保存的数据是否重复
			db.query(sql, [], function(result, fields){
				// 2、重复了-直接返回
				if(result.data.length > 0){
					res.json({code: 0, msg: "数据重复"})
				}else{
					// 3、不重复（有编号走更新，没有走插入）
					if(params.bh){
						sql = `UPDATE bzx_web_type SET bzmc='${params.bzmc}', bzbh='${params.bzbh}' WHERE bh='${params.bh}'`
						db.query(sql, data.data, function(result, fields){
							res.send(result)
						})
					}else{
						let field = ['*bh', '*bzbh', '*bzmc'];
						let d = { 'bh': createId(), 'bzbh': params.bzbh, 'bzmc': params.bzmc };
						bodyDealWith(field, d, function(data){
							sql = `INSERT INTO bzx_web_type(${data.name}) VALUES (${data.questionMark})`
							db.query(sql, data.data, function(result, fields){
								res.send(result)
							})
						})
					}
				}
			})
		}else{
			res.json({
				code: 0,
				msg: "该账号无访问权限"
			})
		}
	})
})

/**
 * 网址类型删除
 * @param {string} bh
 * 
*/
router.post('/delWebType', (req, res, next) =>{
	let params = req.body;
	verifyTokenMiddle(req, res, next, function(data) {
		let userId = data.info.userId;
		if(userId == "") res.json(onLogin);
		let level = data.info.level;
		if(level >= 2){
			let sql = `DELETE FROM bzx_web_type WHERE bh='${params.bh}'`;
			db.query(sql, [], function(result, fields){
				res.send(result)
			})
		}else{
			res.json({
				code: 0,
				msg: "该账号无访问权限"
			})
		}
	})
})


module.exports = router;