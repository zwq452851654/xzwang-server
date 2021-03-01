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
        if(!userId) res.send(onLogin);
        let level = data.info.level;
        let sql;
        if(level >= 2){
            sql = `select * from nav_bcyl`
            db.query(sql, [], function (result, fields) {
				res.send(result)
			})
        }else{
            res.json({
				code: 0,
				msg: "该账号无访问权限"
			})
        }
	})
});

module.exports = router;