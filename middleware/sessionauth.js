const session = require('express-session');


module.exports=function sessionauth(req,res,next)
{
    
    const sess=req.session;
    if(!sess.user) return res.status(401).send({error:' Session Access Denied'})
    next();
    
}