const { createBlackList }=require('jwt-blacklist')

const Blacklist =  createBlackList({
       daySize: 10000, //  number of tokens need revoking each day
       errorRate: 0.001, // optional, error rate each day
       storeType: 'redis', // store type
       redisOptions: {
         host: 'localhost',
         port: 6379,
         key: 'jwt-blacklist', // optional: redis key prefix
       }, // optional, redis options
     });


     module.exports=Blacklist;