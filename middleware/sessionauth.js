
////////////////authentication //////////////////////////////
//////////////check session and session cookie are exist  or no /////////////////
module.exports = function sessionauth(req, res, next) {
    ///// check if there is a established session or no 
    const sess = req.session;
    if (!sess.user && !req.cookies.user) return res.status(401).send({ error: ' Session Access Denied' })

    next();

}