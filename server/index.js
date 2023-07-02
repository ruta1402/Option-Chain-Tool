const express = require('express');
const app = express();
const port = process.env.PORT || 8989
const net = require('net');
const http = require('http');
const cors = require('cors')
const socketIO = require('socket.io');
const {socketConnection} = require('./Feed_data')


app.use(cors())
app.use(express.json())




const server = http.createServer(app);
const io = socketIO(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:['GET',"POST"],
  }
});

app.use(cors());
app.use(express.json());

// io.on('connection', (socket) => {
//   console.log('A client connected');

//   // Send data to the client
//   const data = 'Hello from server!';
//   socket.emit('data', data);

//   socket.on('disconnect', () => {
//     console.log('A client disconnected');
//   });
// });

 socketConnection();

// Define a route to handle the socket connection and market data processing

server.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})




