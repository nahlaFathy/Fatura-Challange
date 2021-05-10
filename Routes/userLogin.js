
const express = require('express');
const router = express.Router();
const User = require('../Controller/user')
const validate = require('../middleware/reqBodyValidator')
const { body, validationResult } = require('express-validator');

router.post("/user/login", validate.LoginValidationRules(), validate.validateLogin, User.login)

module.exports = router
