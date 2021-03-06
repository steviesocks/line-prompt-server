const app = require('express')();
const http = require('http').createServer(app)
const path = require('path')
const fs = require('fs')
const port = process.env.PORT || 5000;
let io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: "*"
  }
})
const ss = require('socket.io-stream')

const transcribeAudioStream = require('./googleSTTCall')

// console.log that your server is up and running
http.listen(port, () => console.log(`Listening on port ${port}`));

io.on('connection', (client) => { /* socket object may be used to send specific messages to the new connected client */
  console.log('new client connected');
  client.emit('connection', null);

  ss(client).on('stream', function(stream, data) {
    const filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream(filename));
    transcribeAudioStream(stream, (transcribeObj) => {
      const chunk = transcribeObj.results[0]
      console.log(chunk)
      client.emit('results', chunk)
  })

});

});
