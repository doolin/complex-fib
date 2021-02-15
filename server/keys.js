module.exports = {
  // Should these be the same as `worker/keys.js`?
  redisHost: process.env.COMPLEX_FIB_REDIS_HOST,
  redisPort: process.env.COMPLEX_FIB_REDIS_PORT,
  
  pgUser: process.env.COMPLEX_FIB_PG_USER,
  pgHost: process.env.COMPLEX_FIB_PG_HOST,
  pgDatabase: process.env.COMPLEX_FIB_PG_DATABASE,
  pgPassword: process.env.COMPLEX_FIB_PG_PASSWROD,
  pgPort: process.env.COMPLEX_FIB_PG_PORT
};