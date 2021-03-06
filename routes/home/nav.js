const express = require('express');
const router = express.Router();
const url = require("url");
const db = require('../../mysql');
var { verifyTokenMiddle } = require("../../common/token.js");
const { bodyDealWith } = require('../../common/index.js');
const request = require('request');
const md5 = require('md5-node');
const { json } = require('body-parser');
const urlencode = require('urlencode');


const onLogin = {
	code: 1,
	msg: '未登录',
	data: []
}



/**
 * 查询所有导航
 * */
router.get('/queryAllNav', (req, res, next) => {
	let sql = `SELECT * FROM all_navigation`
	db.query(sql, [], function (result, fields) {
		res.send(result)
	})
});

/**
 * 查询搜索项
 * */
router.get('/querySearchList', (req, res, next) => {
	verifyTokenMiddle(req, res, next, function (data) {
		let userId = data.info.userId;
		let sql;
		if (userId) {
			sql = `
				SELECT s.name,s.value,s.url,s.icon,u.searchIAims 
				FROM search_list s,user_specific u 
				WHERE u.userId='${userId}'
			`
		} else {
			sql = `
				SELECT s.id,s.name,s.value,s.url,s.icon,d.value searchIAims 
				FROM search_list s,default_data d 
				WHERE d.type=2;
			`
		}
		db.query(sql, [], function (result, fields) {
			res.send(result)
		})
	})
});

/* 
 * 设置搜索项
 */
router.post('/setSearchAims', (req, res, next) => {
	let params = req.body;
	verifyTokenMiddle(req, res, next, function (data) {
		let userId = data.info.userId;
		if (userId) {
			let sql = `UPDATE user_specific SET searchIAims='${params.value}' WHERE userId='${userId}'`
			db.query(sql, [], function (result, fields) {
				res.send(result)
			})
		} else {
			res.json(onLogin)
		}

	})
});

/**
 * 查询导航
 * @param {parentValue}  = [value] 
 * @param {childValue}  = [value] 
 * */
router.get('/queryNav', (req, res, next) => {
	let params = req.query;
	let sql = `SELECT * FROM all_navigation WHERE parentValue='${params.parentValue}'`
	if (params.childValue) {
		sql = `SELECT * FROM all_navigation WHERE parentValue='${params.parentValue}' and childValue='${params.childValue}'`
	}
	db.query(sql, [], function (result, fields) {
		res.send(result)
	})
});

/**
 * 查询常用导航
 * 根据token解析出用户编号，进行查询
 * 如未登录查询默认常用导航
 * */
router.get('/query_often_nav', (req, res, next) => {
	verifyTokenMiddle(req, res, next, function (data) {
		let userId = data.info.userId;
		if (userId) {
			let sql = `SELECT n.dhbh,n.name,n.icon,n.url,o.order FROM often_nav o,all_navigation n WHERE o.dhbh = n.dhbh and o.userId='${userId}' ORDER BY o.order`
			db.query(sql, [], function (result, fields) {
				if (result.data.length > 0) {
					res.send(result)
				} else {
					query_default_often_nav(res)
				}
			})
		} else {
			// res.send(onLogin);
			query_default_often_nav(res)
		}
	})
})


/**
* 查询默认常用导航
* 在已登录的情况下未查询到具体的常用导航设置时查询默认导航
* */
function query_default_often_nav(res) {
	let sql = `SELECT * FROM default_data,all_navigation WHERE type=1 AND default_data.value=all_navigation.dhbh`
	db.query(sql, [], function (result, fields) {
		res.send(result)
	})
}



/**
* 创建ID
* */
function createId() {
	let time = new Date().getTime() + '';
	let m, str = "D";
	for (let i = 0; i < 5; i++) {
		m = Math.random() * time.length
		str += time.slice(m, ++m);
	}
	return str
}

/**
  * 常用导航-添加
  * */
router.post('/addOftenNav', (req, res, next) => {
	let params = req.body;
	verifyTokenMiddle(req, res, next, function (data) {
		let userId = data.info.userId;
		let field = ['*id', '*userId', '*dhbh'];
		let id = createId();
		let d = { 'id': id, 'userId': userId, 'dhbh': params.dhbh }
		bodyDealWith(field, d, function (data) {
			let sql = `INSERT INTO often_nav(${data.name}) VALUES (${data.questionMark})`
			db.query(sql, data.data, function (result, fields) {
				res.send(result)
			})
		})
	})
})

/**
 * 常用导航-删除
 * */
router.post('/delOftenNav', (req, res, next) => {
	let dhbh = req.body.dhbh;
	verifyTokenMiddle(req, res, next, function (data) {
		let userId = data.info.userId;
		let sql = `DELETE FROM often_nav WHERE userId='${userId}' AND dhbh='${dhbh}'`
		db.query(sql, [], function (result, fields) {
			res.send(result)
		})
	})
})


/**
* 常用导航-自定义排序
* */
router.post('/setOftenNavOrder', (req, res, next) => {
	let params = req.body;
	let zd = params.zd;
	let bd = params.bd;
	verifyTokenMiddle(req, res, next, function (data) {
		let userId = data.info.userId;
		let sql = `UPDATE often_nav t1 
			JOIN often_nav t2
			ON (t1.order = ${zd} AND t2.order = ${bd} AND t1.userId = '${userId}' AND t2.userId = '${userId}')
			SET t1.dhbh = t2.dhbh,t2.dhbh=t1.dhbh,t1.id = t2.id,t2.id=t1.id;`
		db.query(sql, [], function (result, fields) {
			res.send(result)
		})
	})
})


/**
 * 遗漏补充
 * */
router.post('/addBcyl', (req, res, next) => {
	let params = req.body;
	verifyTokenMiddle(req, res, next, function (data) {
		let userId = data.info.userId;
		if (userId) {
			let field = ['*id', '*userId', '*name', 'icon', '*url', 'parentName', 'parentValue', 'childName', 'childValue', 'other', 'state'];
			let id = createId();
			let d = { 
				'id': id, 
				'userId': userId, 
				'name': params.name, 
				'icon': params.icon, 
				'url': params.url, 
				'parentName': params.parentName, 
				'parentValue': params.parentValue,
				'childName': params.childName,
				'childValue': params.childValue,
				'other': params.other,
				'state': '0'
			}
			
			bodyDealWith(field, d, function (data) {
				console.log(data)
				let sql = `INSERT INTO nav_bcyl(${data.name}) VALUES (${data.questionMark})`
				db.query(sql, data.data, function (result, fields) {
					res.send(result)
				})
			})
		} else {
			res.json(onLogin)
		}

	})
})


/**
 * 遗漏补充-审核
 * */
 router.post('/navReview', (req, res, next) =>{
 	let params = req.body;
	verifyTokenMiddle(req, res, next, function (data) {
		let userId = data.info.userId;
		if(userId == "") res.json(onLogin);
		let level = data.info.level;
		if(level >= 2){
			let field = ['*name','icon','*url','*parentName','*parentValue','childName','childvalue'];
			let d = {
				'name': params.name,
				'icon': params.icon,
				'url': params.url,
				'parentName': params.parentName,
				'parentValue': params.parentValue,
				'childName': params.childName,
				'childvalue': params.childvalue
			}
			bodyDealWith(field, d, function (data) {
				let sql;
				// 通过审核
				if(params.state == '1'){
					sql = `
						INSERT INTO all_navigation(${data.name}) VALUES (${data.questionMark});
						UPDATE nav_bcyl SET state='${params.state}' WHERE id='${params.id}'
					`
					db.query(sql, data.data, function (result, fields) {
						res.send(result)
					})
				}else{
					// 审核拒绝
					sql = `UPDATE nav_bcyl SET state='${params.state}' WHERE id='${params.id}'`
					db.query(sql, [], function (result, fields) {
						res.send(result)
					})
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
 * 首页搜索提示（查的百度的搜索提示）
 * */
 router.get('/sugrec', (req, res, next)=>{
 	let params = req.query;

 	let options = {
		method: 'get',
		url: `
			https://www.baidu.com/sugrec?pre=1&p=3&ie=utf8&json=1&prod=${params.prod}&from=pc_web&sugsid=33425,33429,33261,33344,31253,33570,33392,26350&wd=${encodeURI(params.wd)}&req=2&csor=2&pwd=ruh`,
	};
 	request(options, function (err, res1, body) {
		if (err) {
			res.json({
				code: 0,
				msg: "内容搜索失败"
			})
		}else {
			let b = JSON.parse(body)
		  	res.json({
		  		code: 1,
				data: b.g || []
		  	})
		}
	})
 })


  /**
 * 首页百度翻译
 * */
router.get('/fanyi', (req, res, next)=>{
	let params = req.query;
	let s = `20200105000372897${params.q}1435660288NMUOvO8KNBAT4ACj1Q56`;
	let m = md5(s)
	let options = {
		method: 'get',
		url: `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${urlencode(params.q)}&from=${params.from}&to=${params.to}&appid=20200105000372897&salt=1435660288&sign=${m}`
	};
 	request(options, function (err, res1, body) {
		if (err) {
			res.json({
				code: 0,
				msg: "翻译失败，请重试"
			})
		}else {
			let d = JSON.parse(body)
			res.json({
				code: 1,
				data: d.trans_result
			})
		}
	})
})




module.exports = router;
