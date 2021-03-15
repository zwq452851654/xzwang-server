var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../../mysql');
var cookieParser = require('cookie-parser')

var { createToken, verifyTokenMiddle } = require("../../common/token.js")

var { bodyDealWith } = require('../../common');

// 生成userId并查询是否重复，是：重新生成 否添加入库
const createUserID = (body, res)=>{
	let time = new Date();
	let y = time.getFullYear();
	let m = time.getMonth()+1;
	let d = time.getDate();
	m = m < 10 ? '0'+m : m;
	d = d < 10 ? '0'+d : d;
	let n = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
	let u = '_'+y+m+d+n;
	let sql = `SELECT * FROM user_account WHERE userId='${u}' OR account='${body.account}'`
	db.query(sql, function(result,fields){
		if(fields.length == 0){
			body.userId = u;
			body.level = 1; //注册时初始化默认权限为1（普通用户）
			addUser(body, res)
		}else{
			if(fields[0].account == body.account){
				res.json({
					'code': 0,
					'msg': '用户名已存在'
				})
			}else{
				createUserID();
			}
		}
	});
}

/**
* 创建ID
* */
function createId() {
	let time = new Date().getTime() + '';
	let m, str = "";
	for (let i = 0; i < 5; i++) {
		m = Math.random() * time.length
		str += time.slice(m, ++m);
	}
	return str
}

// 数据插入
const addUser = (body, res, u)=>{
	let field = ['userId','phone','email','account','pass','openId','level'];
	let m = ['id', 'userId', 'searchAims'];
	let u_id = createId();
	let defaultAims = 'baidu';
	bodyDealWith(field, body, function(data){
		let sql = `
			INSERT INTO user_account(${data.name}) VALUES (${data.questionMark});
			INSERT INTO user_specific(id,userId,searchIAims) VALUES('${u_id}', '${body.userId}', '${defaultAims}')
		`
		db.query(sql, data.data, function(result,fields){
			result.data = [];
			res.json(result)
		});
	})
}
// 注册
router.post('/reg', (req, res, next) =>{
	let body = req.body;
	createUserID(body, res);
})

// 登录
router.post('/login', (req, res, next) =>{
	let body = req.body;
	// 用户名登录
	let sql = `select * from user_account where account='${body.account}' and pass='${body.md5Pass}'`
	db.query(sql, function(result, fields){
		if(fields.length > 0){
			let v = createToken(body.account, fields[0].userId);
			// res.setHeader('Set-cookie','token=' + v);
			res.cookie("token", {token: v}, {maxAge: 86400});
			res.json({
				'code': 1,
				'msg': '登录成功',
				'token': v
			})
		}else{
			res.json({
				'code': 0,
				'msg': '用户名或密码错误'
			})
		}
	})
})


/**
 * 权限菜单
 * */
 router.get('/queryMenu', (req, res, next) => {
	verifyTokenMiddle(req, res, next, function (data) {
		let userId = data.info.userId;
		if(userId){
			let sql = `SELECT * FROM navMenu WHERE userId='${userId}'`
			db.query(sql, [], function (result, fields) {
				console.log(result.data)
				res.send(result)
			})
		}
	})
});



/**
 * 用户信息
 * */
router.get('/userInfo', (req, res, next) =>{
	verifyTokenMiddle(req, res, next, function(data){
		let userId = data.info.userId;
		if(userId){
			let sql = `SELECT *,u.userId FROM user_specific u, file_table f WHERE u.userId='${userId}' AND u.bgImg=f.bh`
			db.query(sql, [], function(result, fields){
				res.send(result)
			})
		}else{
			res.json({
				code: 1,
				msg: '未登录',
				data: []
			})
		}
		
	})
})



module.exports = router;