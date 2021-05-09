const express = require('express');
const router = express.Router();
const User =require('../Controller/user');
const jwtauth =require('../middleware/jwtauth');
const sessionauth=require('../middleware/sessionauth');
const { body, validationResult } = require('express-validator');
const Blacklist =require('../helper/TokenBlackList');
const roles=require('../Controller/userRoles')


// get logined user 
router.get('/loginUser',jwtauth,sessionauth,roles.grantAccess('readOwn','profile'),async(req,res)=>{
       const loginedID=req.user.ID;
       var user=await User.getUserById(loginedID)
       if(user.recordsets[0].length==0) return res.status(404).send("This user id is not exist")
       else return res.send(user.recordsets[0]);
    
})


// get  user by id
router.get('/:id',jwtauth,sessionauth,roles.grantAccess('readAny','profile'),async(req,res)=>{
       const id=req.params.id;
       var user=await User.getUserById(id)
       if(user.recordsets[0].length==0) return res.status(404).send("This user id is not exist")
       else return res.send(user.recordsets[0]);
    
})


/// get all users 
router.get('/',jwtauth,sessionauth,roles.grantAccess('readAny','profile'),async(req,res)=>{
 
       var user=await User.getUsers()
       if(user) return res.send(user.recordsets[0]);
       else return res.status(404).send("something went wrong")
    
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
router.patch('/',jwtauth,sessionauth,roles.grantAccess('updateOwn','profile'),async(req,res)=>{
       
       const loginedID=req.user.ID;
       var updatedUser=await User.updateUser(loginedID,req.body);
       return res.status(updatedUser.code).send(updatedUser.message);
})
//update user by id
router.patch('/:id',jwtauth,sessionauth,roles.grantAccess('updateAny','profile'),async(req,res)=>{
       
       const id=req.params.id;
       var updatedUser=await User.updateUser(id,req.body);
       return res.status(updatedUser.code).send(updatedUser.message);
})


// delete user
router.delete('/',jwtauth,sessionauth,roles.grantAccess('deleteOwn','profile'),async(req,res)=>{
       const loginedID=req.user.ID;
       var deletedUser=await User.DeleteUser(loginedID);
       return res.send(deletedUser);
})

// delete user by id
router.delete('/:id',jwtauth,sessionauth,roles.grantAccess('deleteAny','profile'),async(req,res)=>{
       const id=req.params.id;
       var deletedUser=await User.DeleteUser(id);
       return res.send(deletedUser);
})

/// logout
router.get('/logout',jwtauth,sessionauth,async(req,res)=>
   {
        token=req.token;
      
        /// invalidate token by adding it to blacklist
       (await Blacklist).add(token);
     
       //// invalidate session token by destroy it 
        req.session.destroy(err => {
              if (err) {
              return console.log(err);
              }
        res.send("Loggedout successfully");
   })})
   
module.exports=router
