const jwt = require('jsonwebtoken');
const secret = "qingge1992";	//签名

const db = require('../mysql');


const getCookie = (key)=>{
    const cookies = req.headers.cookie;
    const arr = cookies.split("; ");
    for(var i=0;i<arr.length;i++){
        let newArr = arr[i].split("=");
        if(newArr[0] == key){
            return newArr[1];
        }
    }
}

/**
 * 根据用户名称、用户编号创建token
 * username
 * userId
 * */
const createToken = (username, userId)=>{
    const payload = {
        user:username,
	    userId,
    }
    return jwt.sign(payload, secret,{expiresIn:'1h'});
}

/**
 * 验证token
 * state: false验证失败，true成功 
 * data: 验证后的结果返回
 * decoded:指的是tokneid解码后用户信息
 * callback: 回调函数
 * */

const verifyTokenMiddle = (req, res, next, callback)=>{
    let token = req.headers.token;
    jwt.verify(token, secret, function(err, decoded) {
		let data = {}
        // data = {
        //     code: 0,
        //     msg: "token验证失败"
        // }
        // res.json(data)
        // return false
		if(err){
			data = {
				code: 0,
				info: "token验证失败"
			}
            callback(data)
		}else{
            let sql = `SELECT * FROM user_account WHERE userId='${decoded.userId}'`
            db.query(sql, [], function (result, fields) {
                data = {
                    state: true,
                    info: result.data[0]
                }
                callback(data)
            })
			
		}
        
  });  
}

module.exports = {
    createToken,
    verifyTokenMiddle 
}