var jwt = require('jsonwebtoken');
const JWT_SECRET="ayushagrawal";
const fetchuser=(req,res,next)=>{
//get user from jwt token and add id to req obj
const token=req.header('auth-token');
if(!token){
    res.status(400).send({error:"Please authenticate using valid token"});
}
try {
   const data=jwt.verify(token,JWT_SECRET);
   req.user=data.user;
   next(); 
} catch (error) {
    res.status(401).send({error:"Please authenticate using a valid toekn"});
}
}
module.exports= fetchuser;