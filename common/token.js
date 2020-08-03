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

//创建token
const createToken = (username)=>{
    const payload = {
        user:username
    }
    return jwt.sign(payload, secret,{expiresIn:'1h'});
}

//验证token
const verifyTokenMiddle = (req,res,next)=>{
    let token = req.headers.token;
    jwt.verify(token, secret, function(err, decoded) { // decoded:指的是tokneid解码后用户信息
				if(err){
						return res.json({
								state:false,
								info:"token验证失败"
						})
				}
				next()
  });  
}

module.exports = {
    createToken,
    verifyTokenMiddle 
}