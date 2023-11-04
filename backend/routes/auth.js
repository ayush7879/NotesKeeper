const express= require('express');
const router= express.Router();
const User= require("../models/User")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { body,validationResult} = require('express-validator');
const { response } = require('express');
const fetchuser= require('../middleware/fetchuser');
//ROUTE:1 Create a User using :POST "/api/auth/"
const JWT_SECRET="ayushagrawal";
router.post('/createuser',[body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min:5})],async(req,res)=>{
      let success=false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ success,errors: errors.array() });
        }

try {
 
        let user= await User.findOne({email:req.body.email});
        if(user){
          return res.status(400).json({error:"Sorry user with this email already exist"})
        }
        const salt= await bcrypt.genSalt(10);
       const secpass= await bcrypt.hash(req.body.password,salt);
       user= await User.create({
            name:req.body.name,
            email: req.body.email,
            password: secpass,
          });
          const data={
            user:{
              id:user.id
            }
          };
          const authtoken=jwt.sign(data,JWT_SECRET);
          // console.log(authtoken);
          success=true;

          res.json({success,authtoken:authtoken}); 
      
      } catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
      }
})


//ROUTE:2//Authentication
let success=false;
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()],async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json(success,{ errors: errors.array() });
        }
        const {email,password}=req.body;
        try {
          let user= await User.findOne({email});
          if(!user){
            return res.status(400).json({errors:"Please try to login with correct credentials"});
          }
          const passwordcompare= await bcrypt.compare(password,user.password);
          if(!passwordcompare){
            
            return res.status(400).json({success,errors:"Please try to login with correct credentials"});
          }
          const data={
            user:{
              id:user.id
            }
          }
          const authtoken=jwt.sign(data,JWT_SECRET);
          success=true;
          res.json({success,"authtoken":authtoken});

        } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal Server Error");
              }
      })
//ROUTE :3 FETCH USER DATA

router.post('/getuser',fetchuser,async(req,res)=>{
 const userid=req.user.id;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }


try {
  const user= await User.findById(userid).select("-password");
  res.send(user);
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
      }
    })


module.exports=router