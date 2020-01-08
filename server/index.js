const http = require('http');
const mongoose = require('mongoose');
const { selectNewPhoto } = require('./scripts/photos');
const { sendMessage } = require('./scripts/slack');
require('dotenv').config();

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
  if (req.method == 'GET' && req.url == '/api/2fb14679ba35ea61da7dc15cf88083f3') {
    try {
      var selectedPhoto = await selectNewPhoto();
      sendMessage(selectedPhoto.urls.full);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ message: "Success" }));
      res.end();
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ Error: e }));
      res.end();
    }
  } else {
    try {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ message: "Hello World" }));
      res.end();
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ Error: e }));
      res.end();
    }
  }
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

setInterval(async function () {
  var date = new Date();
  const leadingZero = (num) => `0${num}`.slice(-2);
  const formatTime = (date) =>
    [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map(leadingZero)
      .join(':');
  if (formatTime(date) == "00:00:00") {
    var selectedPhoto = await selectNewPhoto();
    sendMessage(selectedPhoto.urls.full);
  }
}, 1000);

server.listen(port, ()=> {
  console.log(`Server running at http://${hostname}:${port}/`);
});
