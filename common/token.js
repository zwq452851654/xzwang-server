const jwt = require('jsonwebtoken');
const secret = "qingge1992";	//签名


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
		if(err){
			data = {
				state: false,
				info: "token验证失败"
			}
		}else{
			data = {
				state: true,
				info: decoded
			}
		}
        callback(data)
  });  
}

module.exports = {
    createToken,
    verifyTokenMiddle 
}