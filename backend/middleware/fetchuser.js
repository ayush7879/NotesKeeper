var jwt = require('jsonwebtoken');
const JWT_SECRET="ayushagrawal";
const fetchuser=(req,res,next)=>{
//get user from jwt token and add id to req obj
const token=req.header('auth-token');
if(!token){
    return res.status(401).json({success: false, error:"Please authenticate using valid token"});
}
try {
   const data=jwt.verify(token,JWT_SECRET);
   req.user=data.user;
   next(); 
} catch (error) {
    return res.status(401).json({success: false, error:"Please authenticate using a valid token"});
}
}
module.exports= fetchuser;