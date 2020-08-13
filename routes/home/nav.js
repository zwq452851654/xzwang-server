var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../../mysql');
var { verifyTokenMiddle } = require("../../common/token.js")


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
 * 
 * */
 
 router.get('/query_often_nav', (req, res, next) =>{
	verifyTokenMiddle(req, res, next, function(data){
		let userId = data.info.userId;
		let sql = `SELECT n.dhbh,n.name,n.icon,n.url FROM ofent_nav o,all_navigation n WHERE o.dhbh = n.dhbh and o.userId='${userId}'`
		db.query(sql, [], function(result, fields){
			console.log(result)
			res.end()
		})
	})
 })

module.exports = router;
