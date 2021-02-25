const express = require('express');
const router = express.Router();
const db = require('../../mysql');
const { verifyTokenMiddle } = require("../../common/token.js")
const { bodyDealWith } = require('../../common/index.js')


var onLogin = {
	code: 1,
	msg: '未登录',
	data: []
}


/**
 * 根据用户ID查询收藏夹的一级列表
 * */ 
router.get('/queryCollect', (req, res, next) =>{
	verifyTokenMiddle(req, res, next, function(data) {
		let userId = data.info.userId;
		if(userId){
			let sql = `SELECT * FROM parent_collect WHERE userId='${userId}' order by type desc`;
			db.query(sql, [], function (result, fields) {
				res.send(result)
			})
		}else{
			res.json(onLogin)
		}
	})
})

/**
 * 根据用户ID、编号查询收藏夹对应的二级列表
 * */ 
router.get('/querySecondCollect', (req, res, next) =>{
	let params = req.query;
	verifyTokenMiddle(req, res, next, function(data) {
		let userId = data.info.userId;
		if(userId){
			let sql = `SELECT * FROM child_collect WHERE userId='${userId}' AND parentId='${params.bh}'`;
			db.query(sql, [], function (result, fields) {
				res.send(result)
			})
		}
	})
})


/* 
 * 网站收藏 - 添加
 * @param {string} type: 1(一级收藏夹地址)、 2(二级收藏夹地址)
 */
router.post('/addCollect', (req, res, next) => {
	let params = req.body;
	verifyTokenMiddle(req, res, next, function(data){
		let userId = data.info.userId;
		if(userId){
			let field,d,sql;
			let id = createId();
		    field = ['*bh', 'parentId', '*userId', '*mc', '*type', '*url'];
		    d = { 
		    	'bh': id, 
		    	'parentId':params.parentID, 
		    	'userId':userId, 
		    	'mc':params.mc,
		    	'type': 1, 
		    	'url':params.url
		   	}
		    bodyDealWith(field, d, function(data){
		    	if(params.type == 2){
		    		sql = `INSERT INTO child_collect(${data.name}) VALUES (${data.questionMark})`
		    	}
		    	if(params.type == 1){
		    		sql = `INSERT INTO parent_collect(${data.name}) VALUES (${data.questionMark})`
		    	}
		        db.query(sql, data.data, function(result, fields){
		        	res.send(result)
		        })
		    })
		}else{
			res.send(onLogin)
		}
	})
});


/* 
 * 收藏夹 - 新增文件夹
 */
router.post('/addFolder', (req, res, next)=>{
	let params = req.body;
	verifyTokenMiddle(req, res, next, function(data){
		let userId = data.info.userId;
		if(userId){
			let id = createId();
			let field = ['*bh', '*userId', '*mc', '*type'];
		    let d = { 'bh': id, 'userId':userId, 'mc':params.mc,'type':params.type};
			bodyDealWith(field, d, function(data){
	    		let sql = `SELECT * FROM parent_collect WHERE userId='${userId}' AND bh='${params.bh}'`
	    		db.query(sql, data.data, function(result, fields){
	    			if(result.data.length > 0){
	    				sql = `UPDATE parent_collect SET mc='${params.mc}' WHERE userId='${userId}' AND bh='${params.bh}'`;
	    			}else{
	    				sql = `INSERT INTO parent_collect(${data.name}) VALUES(${data.questionMark})`;
	    			}
			       	db.query(sql, data.data, function(result, fields){
			        	res.send(result)
			        })
			    })
			})
		}else{
			res.send(onLogin)
		}
	})

})



/* 
 * 收藏夹内容删除
 */
 router.post('/delCollectItem', (req, res, next)=>{
 	let params = req.body;
	verifyTokenMiddle(req, res, next, function(data){
		let userId = data.info.userId;
		let sql;
		if(userId){
			if(params.type == 1){
				if(params.parentId){
					sql = `DELETE FROM child_collect WHERE  userId='${userId}' AND bh='${params.bh}'`
				}else{
					sql = `DELETE FROM parent_collect WHERE userId='${userId}' AND bh='${params.bh}'`
				}
				db.query(sql, [], function(result, fields){
		        	res.send(result)
		        })
			}
			if(params.type == 2){
				// 先查询是否有子级内容，如果没有才直接删除文件夹，否则先删除文件夹内子级内容
				sql = `SELECT * FROM child_collect WHERE userId='${userId}' AND parentId='${params.bh}'`
				db.query(sql, [], function(result, fields){
					if(result.data.length > 0){
						res.send({
							code: 0,
							msg: '文件夹内包含子级内容，请先删除子级内容',
							data: []
						})
					}else{
						sql = `DELETE FROM parent_collect WHERE userId='${userId}' AND bh='${params.bh}'`;
						db.query(sql, [], function(result, fields){
				        	res.send(result)
				        })
					}
		        	
		        })
				
			}
			
		}
	})
 })


function createId(){
	let time = new Date().getTime() + '';
	let m,str="SC";
	for(let i=0; i<5; i++){
		m = Math.random()*time.length
		str += time.slice(m, ++m);
	}
	return str
}

	
	
	

module.exports = router;
