const express = require('express');
const app = express();
const port = process.env.PORT || 8989
const net = require('net');
const http = require('http');
const cors = require('cors')
const {socketConnection} = require('./Feed_data')


app.use(cors())
app.use(express.json())




const server = http.createServer(app);


app.use(cors());
app.use(express.json());



socketConnection(server);



server.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})

module.exports= {server} 