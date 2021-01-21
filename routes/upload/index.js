const express = require('express');
const router = express.Router();
const db = require('../../mysql');
const { verifyTokenMiddle } = require("../../common/token.js");
const { bodyDealWith, batchDealWith } = require('../../common/index.js');


function createId(){
	let time = new Date().getTime() + '';
	let m,str = "FJ";
	for(let i=0; i<12; i++){
		m = Math.random()*time.length
		str += time.slice(m, ++m);
	}
	return str
}



router.post("/saveFileInfo", (req, res, next)=>{
	// 多个数据存储
	let body = req.body;
	let field = ['*bh', 'userId', 'date', 'oldName', 'newName', 'path'];
	let list = body.filesData;
	// list.forEach(item =>{
	// 	item['id'] = createId();
	// })

	batchDealWith(field, list, function(data){
		if(data.code){
			let sql = `INSERT INTO file_table(${data.name}) VALUES ?`;
			db.query(sql, [data.data], function(result,fields){
				if(result.code){
					res.json({
						code: result.code,
						msg: "保存成功"
					})
				}else{
					res.json({
						code: result.code,
						msg: "保存失败"
					})
				}
			});
		}else{
			console.log('数据处理失败...')
		}
	})


	// 单个数据存储
	// let body = req.body;
	// let id = createId();
	// let field = ['*id', 'userId', 'date', 'oldName', 'newName', 'path'];
	// let d = { 
	// 	'id': id, 
	// 	'userId': body.userId, 
	// 	'date': body.date, 
	// 	'oldName': body.oldName, 
	// 	'newName': body.newName, 
	// 	'path': body.path
	// }
	// bodyDealWith(field, d, function(data){
	// 	let sql = `INSERT INTO file_table(${data.name}) VALUES(${data.questionMark})`;
	// 	db.query(sql, data.data, function(result, fields){
	//     	res.send(result)
	//     })
	// })
})



module.exports = router;