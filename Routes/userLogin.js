const bcrypt=require('bcrypt')
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User =require('../Controller/user')
const jwt=require('jsonwebtoken');



router.post("/login",body('Email').isLength({ min: 1 })
.withMessage('Email is required').isEmail().withMessage("Invalid Email"),
body('Password').isLength({ min: 1 })
.withMessage('Password is required'),async function(req,res){

     /////// validate req body
     const errors = validationResult(req); 
     if (!errors.isEmpty()) return res.status(400).send({error: errors.errors[0].msg });   

     ///// check if email is registered before 
    var user=await User.getUserByEmail(req.body.Email);
    if(user.recordsets[0].length==0) return res.status(403).send("Invalid Email or Password")
    var myUser = user.recordsets[0][0];
     
    
     /////////// chech if password match email password 
   const validPassword=await bcrypt.compare(req.body.Password,myUser.Password)
    if(validPassword===false) return res.status(403).send('Invalid Email or Password') 
                                                                              
    ///// Generate user token 
    const token=jwt.sign({ID:myUser.ID,role:myUser.role},process.env.SECRET_KEY,{ expiresIn: '1h' })
     req.session.user= myUser.ID;
     return res.header('x-user-token',token).send({message:'logined in successfully',
        token:token}) 


})
module.exports=router