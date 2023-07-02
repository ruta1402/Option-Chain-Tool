const express = require('express');
const app = express();
const port = process.env.PORT || 8989
const net = require('net');

const cors = require('cors')
app.use(cors())
app.use(express.json())

const SERVER_HOST = 'localhost';
const SERVER_PORT = 9011;

const {socketConnection} = require('./Feed_data')



socketConnection()
// Define a route to handle the socket connection and market data processing

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})




