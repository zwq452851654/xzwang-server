var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../../mysql');
var { verifyTokenMiddle } = require("../../common/token.js")
var { bodyDealWith } = require('../../common/index.js')

/**
 * 查询所有导航
 * */ 
router.get('/queryAllNav', (req, res, next) => {
	let sql = `SELECT * FROM all_navigation`
	db.query(sql, [], function(result,fields){
		res.json(result)
	})
});

/**
 * 查询搜索项
 * */ 
router.get('/querySearchList', (req, res, next) => {
	verifyTokenMiddle(req, res, next, function(data){
		let userId = data.info.userId;
		let sql = `SELECT s.name,s.value,s.url,u.searchIAims FROM search_list s,user_specific u WHERE u.userId='${userId}'`
		db.query(sql, [], function(result, fields){
			res.json(result)
		})
	})
});

/* 
 * 设置搜索项
 */
router.get('/setSearchAims', (req, res, next) => {
	let params = req.query;
	verifyTokenMiddle(req, res, next, function(data){
		let userId = data.info.userId;
		let sql = `UPDATE user_specific SET searchIAims='${params.value}' WHERE userId='${userId}'`
		db.query(sql, [], function(result, fields){
			res.json(result)
		})
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
	if(params.childValue){
		sql = `SELECT * FROM all_navigation WHERE parentValue='${params.parentValue}' and childValue='${params.childValue}'`
	}
	db.query(sql, [], function(result,fields){
		res.json(result)
	})
});

/**
 * 查询常用导航
 * 根据token解析出用户编号，进行查询
 * 如未登录查询默认常用导航
 * */
 router.get('/query_often_nav', (req, res, next) =>{
	verifyTokenMiddle(req, res, next, function(data){
		let userId = data.info.userId;
		console.log('====', userId)
		let sql = `SELECT n.dhbh,n.name,n.icon,n.url,o.order FROM often_nav o,all_navigation n WHERE o.dhbh = n.dhbh and o.userId='${userId}' ORDER BY o.order`
		db.query(sql, [], function(result, fields){
			res.json(result)
		})
	})
 })


function createId(){
	let time = new Date().getTime() + '';
	let m,str="D";
	for(let i=0; i<5; i++){
		m = Math.random()*time.length
		str += time.slice(m, ++m);
	}
	return str
}
 
/**
  * 常用导航-添加
  * */
  router.post('/addOftenNav', (req, res, next) =>{
    let params = req.body;
    verifyTokenMiddle(req, res, next, function(data){
    	let userId = data.info.userId;
      let field = ['*id', '*userId', '*dhbh'];
			let id = createId();
      let d = { 'id': id, 'userId':userId, 'dhbh':params.dhbh }
      bodyDealWith(field, d, function(data){
        let sql = `INSERT INTO often_nav(${data.name}) VALUES (${data.questionMark})`
        db.query(sql, data.data, function(result, fields){
        	res.json(result)
        })
      })
    })
  })
 
 /**
  * 常用导航-删除
  * */
  router.post('/delOftenNav', (req, res, next) =>{
    let dhbh = req.body.dhbh;
    verifyTokenMiddle(req, res, next, function(data){
    	let userId = data.info.userId;
    	let sql = `DELETE FROM often_nav WHERE userId='${userId}' AND dhbh='${dhbh}'`
    	db.query(sql, [], function(result, fields){
    		res.json(result)
    	})
    })
  })
  
	
	/**
	* 常用导航-自定义排序
	* */
	router.post('/setOftenNavOrder', (req, res, next) =>{
		let params = req.body;
		let zd = params.zd;
		let bd = params.bd;
		verifyTokenMiddle(req, res, next, function(data){
			let userId = data.info.userId;
			let sql = `UPDATE often_nav t1 
				JOIN often_nav t2
				ON (t1.order = ${zd} AND t2.order = ${bd} AND t1.userId = '${userId}' AND t2.userId = '${userId}')
				SET t1.dhbh = t2.dhbh,t2.dhbh=t1.dhbh,t1.id = t2.id,t2.id=t1.id;`
				db.query(sql, [], function(result, fields){
					res.json(result)
				})
		})
	})
	
	
	

module.exports = router;
