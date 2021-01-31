const express = require('express');
const router = express.Router();
const db = require('../../mysql');
const { verifyTokenMiddle } = require("../../common/token.js");
const { bodyDealWith, batchDealWith } = require('../../common/index.js');

var onLogin = {
	code: 1,
	msg: '未登录',
	data: []
}

// 获取遗漏补充列表
router.get('/queryYlbc', (req, res, next) => {
	let params = req.query;
	verifyTokenMiddle(req, res, next, function (data) {
        let userId = data.info.userId;
        let sql;
        if(userId){
            sql = `select * from nav_bcyl`
            db.query(sql, [], function (result, fields) {
				res.send(result)
			})
        }else{
            res.send(onLogin)
        }
	})
});

module.exports = router;