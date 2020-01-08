const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/json');
  res.end('Hello World!\n');
});

try {
  // Connect to mongoDB
  mongoose.connect("mongodb+srv://" +
    process.env.DB_USER +
    ":" +
    process.env.DB_PASS +
    "@" +
    process.env.DB_HOST,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);

  // log connection
  mongoose.connection.on('connected', function () {
    console.log('Connection to MongoDB successful');
  });
} catch (err) {
  console.log('Mongoose connection error: ', err);
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
