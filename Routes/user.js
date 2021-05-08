const express = require('express');
const router = express.Router();
const User =require('../Operations/user');
const jwtauth =require('../middleware/jwtauth');
const sessionauth=require('../middleware/sessionauth');
const { body, validationResult } = require('express-validator');
const Blacklist =require('../helper/TokenBlackList')

/// get all users 
router.get('/',jwtauth,sessionauth,async(req,res)=>{
 
       var user=await User.getUsers()
       if(user) return res.send(user.recordsets[0]);
       else return res.status(404).send("something went wrong")
    
})

// get user by id
router.get('/',jwtauth,sessionauth,async(req,res)=>{
       const loginedID=req.user.ID;
       var user=await User.getUserById(loginedID)
       if(user.recordsets[0].length==0) return res.status(404).send("This user id is not exist")
       else return res.send(user.recordsets[0]);
    
})

/// register new user 
router.post('/register',body('Email').isEmail().withMessage("Invalid Email").isLength({ min: 1 })
.withMessage('Email is required'),
body('Username').isLength({ min: 5 })
.withMessage('Username is required'),
body('Gender').isLength({ min: 1 })
.withMessage('Gender is required')
,body('Age').isNumeric().withMessage("age must be a number").isLength({ min: 1 })
.withMessage('Age is required'),
body('Password').isLength({ min: 5 })
.withMessage('Password must be at least 5 chars long'),async(req,res)=>{
     /////// validate req body
     const errors = validationResult(req); 
     if (!errors.isEmpty()) return res.status(400).send({error: errors.errors[0].msg });  

      let user= await User.addUser(req.body)
    
            return res.status(user.code).send(user.message);
       
       
    })

//update user data
router.patch('/',jwtauth,sessionauth,async(req,res)=>{
       const loginedID=req.user.ID;
       var updatedUser=await User.updateUser(loginedID,req.body);
       return res.send(updatedUser);
})


// delete user
router.delete('/',jwtauth,sessionauth,async(req,res)=>{
       const loginedID=req.user.ID;
       var deletedUser=await User.DeleteUser(loginedID);
       return res.send(deletedUser);
})

router.get('/logout',jwtauth,sessionauth,async(req,res)=>
   {
        token=req.token;
      
       (await Blacklist).add(token);
     
        req.session.destroy(err => {
              if (err) {
              return console.log(err);
              }
        res.send("Loggedout successfully");
   })})
   
module.exports=router
