const express = require('express');
const router = express.Router();
const User = require('../Controller/user');
const jwtauth = require('../middleware/jwtauth');
const sessionauth = require('../middleware/sessionauth');
const roles = require('../middleware/userRoles')
const validate = require('../middleware/reqBodyValidator')


// get logined user 
router.get('/user/loginUser', jwtauth, sessionauth, roles.grantAccess('readOwn', 'profile'), User.getUserById)


// get  user by id
router.get('/user/:id', jwtauth, sessionauth, roles.grantAccess('readAny', 'profile'), User.getUserById)


/// get all users 
router.get('/users', jwtauth, sessionauth, roles.grantAccess('readAny', 'profile'), User.getUsers)



/// register new user 
router.post('/user/register', validate.registerValidationRules(), validate.validateRegister, User.addUser)


//update user data
router.patch('/user', jwtauth, sessionauth, roles.grantAccess('updateOwn', 'profile'), User.updateUser)


//update user by id
router.patch('/user/:id', jwtauth, sessionauth, roles.grantAccess('updateAny', 'profile'), User.updateUser)


// delete user
router.delete('/user', jwtauth, sessionauth, roles.grantAccess('deleteOwn', 'profile'), User.DeleteUser)

// delete user by id
router.delete('/user/:id', jwtauth, sessionauth, roles.grantAccess('deleteAny', 'profile'), User.DeleteUser)


/// logout
router.get('/logout', jwtauth, sessionauth, User.logout)

module.exports = router
