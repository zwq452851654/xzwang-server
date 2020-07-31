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
    let token = getCookie("token");
    jwt.verify(token, scret, function(err, decoded) {
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