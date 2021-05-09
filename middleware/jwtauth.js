const e = require('express');
const jwt=require('jsonwebtoken')
const Blacklist =require('../helper/TokenBlackList')


////////////////authorization //////////////////////////////
//////////////check header token if exist and valid or no /////////////////
module.exports=async function jwtauth(req,res,next)
{    
    //// fetch token from header
    const token=req.header('x-user-token');
    
    
    //// if there is no token sent
    if(!token) return res.status(401).send({error:'Access Denied'})

    ///////////////// check if this token is in the blacklist or no 
    const blocked=async()=>{

       const result= (await Blacklist).has(token)
       return result;
     }

    const BlacklistResult = async () => {
            const result = await blocked()
            return result
     }

    //// if token in blacklist 
    if(await BlacklistResult()===true)return res.status(401).send({error:'Expired Token'})

    //// decode token and verify if it's valid or not
    try{
        const decoded= jwt.verify(token,process.env.SECRET_KEY)
        req.user=decoded
        req.token=token
        
        next()
    }
    catch{
       res.status(400).send({error:'Invalid Token'})
       
    }

}

