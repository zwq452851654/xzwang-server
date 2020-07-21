var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../../mysql');

/**
 * 查询导航
 * @param {parentValue}  = [value] 
 * @param {childValue}  = [value] 
 * */ 
router.get('/queryNav', (req, res, next) => {
	let params = req.query;
	console.log(params.childValue)
	let sql = `SELECT * FROM all_navigation WHERE parentValue=${params.parentValue}`
	if(params.childValue){
		sql = `SELECT * FROM all_navigation WHERE parentValue=${params.parentValue} and childValue=${params.childValue}`
	}
	db.query(sql, [], function(result,fields){
		res.json(result)
	})
});

module.exports = router;
