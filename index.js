
const express = require('express');
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
const app = express();
const port = 3000;
require('./dbConnection');
var cors = require('cors')
require('dotenv').config();
var cookieParser = require('cookie-parser')
const Users = require('./Routes/user');
const UserLogin = require('./Routes/userLogin')
const IN_PROD = process.env.NODE_ENV === 'production'

/// redis error logs
let redisClient = redis.createClient();
redisClient.on('error', err => {
  console.log('Error ' + err);
});

// a middleware that logs the request url, method, and current time 
app.use((req, res, next) => {
  var time = new Date();
  console.log('Time:', time.getHours(), ':', time.getMinutes(), ':', time.getSeconds())
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  next()
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({

  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  cookie: {
    secure: IN_PROD,
    sameSite: true,
    maxAge: 1000 * 60 * 60
  },
  store: new RedisStore({ client: redisClient, ttl: 86400 }),
  resave: false
}))

//////General Routes
app.use('/api', Users)
app.use('/api', UserLogin)

// a global error handler that logs the error 
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send({ error: 'internal server error' })
  next(err);
});

// This middleware will check if user's cookie is still saved in browser and user is not set,
// then automatically log the user out.
app.use((req, res, next) => {
  if (req.cookies.user && !req.session.user) {
    res.clearCookie('user');
  }
  next();
});

app.listen(process.env.PORT || port, () => {
  console.info(`server listening on port ${port}`);
});

