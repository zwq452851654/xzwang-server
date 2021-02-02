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

// 获取消息各类型消息长度（暂未使用）
router.get('/getMsgLength', (req, res, next)=>{
    let params = req.query;
    verifyTokenMiddle(req, res, next, function (data) {
        let userId = data.info.userId;
        if(userId){
            let sql = `select (select count(id) from msg_ux where read_user='${userId}' and state='0') as ux`
            db.query(sql, [], function(result, fields){
                res.send(result)
            })
        }else{
            res.send(onLogin)
        }
    })
})


// 获取消息
router.get('/getMsg', (req, res, next)=>{
    let params = req.query;
    verifyTokenMiddle(req, res, next, function (data) {
        let userId = data.info.userId;
        let s = (params.currentPage-1)*params.pageSize;
        let e = params.currentPage*params.pageSize;
        if(userId){
            let sql = `
                select * from msg_ux where read_user='${userId}'
                order by sendTime desc 
                LIMIT ${s},${e}`;
            db.query(sql, [], function(result, fields){
                res.send(result)
            })
        }else{
            res.send(onLogin)
        }
    })
})


// 更新消息状态
router.post('/updateMsgState', (req, res, next)=>{
    let params = req.body;
    verifyTokenMiddle(req, res, next, function (data) {
        let userId = data.info.userId;
        if(userId){
            let sql = `update msg_ux set state='1',readTime='2020-02-02 13:59:00' where read_user='${userId}' and id='${params.id}'`;
            db.query(sql, [], function(result, fields){
                res.send(result)
            })
        }else{
            res.send(onLogin)
        }
    })
})

// 发送消息
router.post('/sendMsg', (req, res, next) => {
    let params = req.body;
	verifyTokenMiddle(req, res, next, function (data) {
        let userId = data.info.userId;
        if(userId){
            let field = [
                '*id', 
                '*author', 
                '*type', 
                '*title', 
                'descriptio', 
                'content', 
                'state', 
                '*read_user', 
                'relation', 
                'sendTime'
            ];
            let d = {
                id: createId(),
                author: userId,
                type: params.type, 
                title: params.title, 
                descriptio: params.descriptio, 
                content: params.content, 
                state: '0', 
                read_user: params.read_user, 
                relation: params.relation,
                sendTime: '2020-02-02 14:43:00'
            };
            bodyDealWith(field, d, function (data) {
				let sql = `INSERT INTO msg_ux(${data.name}) VALUES (${data.questionMark})`
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