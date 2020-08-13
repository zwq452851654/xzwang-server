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
 * 查询导航
 * @param {parentValue}  = [value] 
 * @param {childValue}  = [value] 
 * */ 
router.get('/queryNav', (req, res, next) => {
	let params = req.query;
	let sql = `SELECT * FROM all_navigation WHERE parentValue=${params.parentValue}`
	if(params.childValue){
		sql = `SELECT * FROM all_navigation WHERE parentValue=${params.parentValue} and childValue=${params.childValue}`
	}
	db.query(sql, [], function(result,fields){
		res.json(result)
	})
});

/**
 * 查询常用导航
 * 根据token解析出用户编号，进行查询
 * */
 
 router.get('/query_often_nav', (req, res, next) =>{
	verifyTokenMiddle(req, res, next, function(data){
		let userId = data.info.userId;
		let sql = `SELECT n.dhbh,n.name,n.icon,n.url FROM ofent_nav o,all_navigation n WHERE o.dhbh = n.dhbh and o.userId='${userId}'`
		db.query(sql, [], function(result, fields){
			res.json(result)
		})
	})
 })
 
/**
  * 常用导航-添加
  * */
  router.post('/addOftenNav', (req, res, next) =>{
    let dhbh = req.body.dhbh;
    verifyTokenMiddle(req, res, next, function(data){
    	let userId = data.info.userId;
      let field = ['*id', '*userId', '*dhbh'];
      let d = { 'id':'D007', 'userId':userId, 'dhbh':dhbh }
      bodyDealWith(field, d, function(data){
        console.log('==', data)
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
    let params = url.parse(req.url, true).query;
    verifyTokenMiddle(req, res, next, function(data){
    	let userId = data.info.userId;
    	let sql = `delete from often_nav where userId='${userId}' and dhbh='${params.dhbh}'`
    	db.query(sql, [], function(result, fields){
    		res.json(result)
    	})
    })
  })
  

module.exports = router;
