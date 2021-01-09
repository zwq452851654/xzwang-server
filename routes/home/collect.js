var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../../mysql');
var { verifyTokenMiddle } = require("../../common/token.js")
var { bodyDealWith } = require('../../common/index.js')


var onLogin = {
	code: 1,
	msg: '未登录',
	data: []
}

router.get('/queryCollect', (req, res, next) =>{
	verifyTokenMiddle(req, res, next, function(data) {
		let userId = data.info.userId;
		if(userId){
			let sql = `SELECT * FROM parent_collect WHERE userId='${userId}'`;
			db.query(sql, [], function (result, fields) {
				res.send(result)
			})
		}
	})
})

router.get('/querySecondCollect', (req, res, next) =>{
	let params = req.query;
	verifyTokenMiddle(req, res, next, function(data) {
		let userId = data.info.userId;
		if(userId){
			let sql = `SELECT * FROM child_collect WHERE userId='${userId}' AND parentId='${params.bh}'`;
			console.log(sql)
			db.query(sql, [], function (result, fields) {
				res.send(result)
			})
		}
	})
})


/* 
 * 网站收藏 - 添加
 * @param {string} type: 1(一级收藏地址)、 2(一级文件目录)
 */
router.post('/addCollect', (req, res, next) => {
	let params = req.body;
	verifyTokenMiddle(req, res, next, function(data){
		let userId = data.info.userId;
		if(userId){
			console.log(params)
			let field,d,sql;
			let id = createId();
		    if(params.type == 2){
		    	field = ['*bh', '*parentId', '*userId', '*mc', '*type'];
		    	d = { 'bh': id, 'parentId':params.parentID,  'userId':userId, 'mc':params.mc,'type':params.type}
		    }else{
		    	field = ['*bh', '*userId', '*mc', '*type', '*url'];
			    d = { 'bh': id, 'userId':userId, 'mc':params.mc,'type':params.type, 'url':params.url }
		    }
		    bodyDealWith(field, d, function(data){
		    	if(params.type == 2){
		    		sql = `INSERT INTO child_collect(${data.name}) VALUES (${data.questionMark})`
		    	}else{
		    		sql = `INSERT INTO parent_collect(${data.name}) VALUES (${data.questionMark})`
		    	}
		        db.query(sql, data.data, function(result, fields){
		        	res.send(result)
		        })
		    })
		}else{
			res.send(onLogin)
		}
	})
});



function createId(){
	let time = new Date().getTime() + '';
	let m,str="SC";
	for(let i=0; i<5; i++){
		m = Math.random()*time.length
		str += time.slice(m, ++m);
	}
	return str
}

	
	
	

module.exports = router;
