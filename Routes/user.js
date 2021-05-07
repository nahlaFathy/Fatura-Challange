const express = require('express');
const router = express.Router();
const User =require('../Operations/user')

 

router.get('/',async(req,res)=>{
 
       var user=await User.getUsers()
       if(user) return res.send(std.recordsets[0]);
       else return res.status(404).send("something went wrong")
    
})

router.get('/:id',async(req,res)=>{
 
       var user=await User.getUserById(req.params.id)
       if(user.recordsets[0].length==0) return res.status(404).send("This user id is not exist")
       else return res.send(user.recordsets[0]);
    
})

router.post('/',async(req,res)=>{
     
       var user=await User.addUser(req.body);
        return res.send(user);
})

router.patch('/:id',async(req,res)=>{
       
       var updatedUser=await User.updateUser(req.params.id,req.body);
       return res.send(updatedUser);
})

router.delete('/:id',async(req,res)=>{
       var deletedUser=await User.DeleteUser(req.params.id);
       return res.send(deletedUser);
})
module.exports=router;