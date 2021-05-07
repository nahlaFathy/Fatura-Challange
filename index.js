
const express = require('express');
const app = express();
const port = 3000;
require('./dbConnection');
var cors = require('cors')
require('dotenv').config();



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


// a global error handler that logs the error 
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send({ error: 'internal server error' })
  next(err);
});


app.listen(process.env.PORT || port, () => {
  console.info(`server listening on port ${port}`);
});

