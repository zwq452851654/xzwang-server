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

function createId() {
	let time = new Date().getTime() + '';
	let m, str = "XX";
	for (let i = 0; i < 5; i++) {
		m = Math.random() * time.length
		str += time.slice(m, ++m);
	}
	return str
}

// 获取遗漏补充列表
router.post('/sendMsg', (req, res, next) => {
    let params = req.body;
    console.log(params)
	verifyTokenMiddle(req, res, next, function (data) {
        let userId = data.info.userId;
        if(userId){
            let field = ['*id', '*author', '*type', '*title', 'descriptio', 'content', 'state', '*read_user', 'relation'];
            let d = {
                id: createId(),
                author: userId,
                type: params.type, 
                title: params.title, 
                descriptio: params.descriptio, 
                content: params.content, 
                state: 0, 
                read_user: params.read_user, 
                relation: params.relation
            };
            bodyDealWith(field, d, function (data) {
				let sql = `INSERT INTO msg_xt(${data.name}) VALUES (${data.questionMark})`
				db.query(sql, data.data, function (result, fields) {
					res.send(result)
				})
			})
        }else{
            res.send(onLogin)
        }
	})
});

module.exports = router;