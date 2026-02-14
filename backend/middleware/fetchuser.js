var jwt = require('jsonwebtoken');
const JWT_SECRET="ayushagrawal";
const fetchuser=(req,res,next)=>{
//get user from jwt token and add id to req obj
const token=req.header('auth-token');
if(!token){
<<<<<<< HEAD
    return res.status(401).json({success: false, error:"Please authenticate using valid token"});
=======
    res.status(400).send({error:"Please authenticate using valid token"});
>>>>>>> 681fd569d3b3d716cf314a41e4d118bce54883f4
}
try {
   const data=jwt.verify(token,JWT_SECRET);
   req.user=data.user;
   next(); 
} catch (error) {
<<<<<<< HEAD
    return res.status(401).json({success: false, error:"Please authenticate using a valid token"});
=======
    res.status(401).send({error:"Please authenticate using a valid toekn"});
>>>>>>> 681fd569d3b3d716cf314a41e4d118bce54883f4
}
}
module.exports= fetchuser;