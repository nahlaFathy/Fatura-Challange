const jwt=require('jsonwebtoken')
const Blacklist =require('../helper/TokenBlackList')


////////////////authorization //////////////////////////////
//////////////check header token if exist and valid or no /////////////////
module.exports=async function jwtauth(req,res,next)
{    
    const token=req.header('x-user-token');
    
    (await Blacklist).has(token).then((data)=>
    {
        if(data===true)return res.status(401).send({error:'Expired Token'})
        
        
    }).catch((err)=>
    {
        console.log(err)
    })
    
    if(!token) return res.status(401).send({error:'Access Denied'})
    try{
        const decoded= jwt.verify(token,process.env.SECRET_KEY)
        console.log(decoded,"token")
        req.user=decoded
        req.token=token
        next()
    }
   catch{
       res.status(400).send({error:'Invalid Token'})
       
   }

}

