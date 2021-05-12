const { createBlackList } = require('jwt-blacklist')


////// create blacklist for loged out to invalidate  tokens
const Blacklist = createBlackList({
  daySize: 10000, //  number of tokens need revoking each day
  errorRate: 0.001, // optional, error rate each day
  storeType: 'redis', // store type
  redisOptions: {
    host: 'localhost',
    port: 6379,
    key: process.env.REDIS_KEY, // optional: redis key prefix
  }
  
});

module.exports = Blacklist;
