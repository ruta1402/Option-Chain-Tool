const express = require('express');
const app = express();
const port = process.env.PORT || 8989
const net = require('net');

const cors = require('cors')
app.use(cors())
app.use(express.json())

const SERVER_HOST = 'localhost';
const SERVER_PORT = 9011;

// Define a route to handle the socket connection and market data processing
app.get('/market-data', (req, res) => {
  try {
    // Establish a socket connection to the server
    const socket = new net.Socket();
    socket.connect(SERVER_PORT, SERVER_HOST, () => {
      console.log(`Connected to the server on port ${SERVER_PORT}`);

      // Send an initial request packet
      socket.write(Buffer.from([1])); // Send a single byte as the initial request
      console.log('Initial request sent');
    });

    // Receive and process market data packets
    const buffer = Buffer.alloc(130); // market data packet size is 130 bytes
    socket.on('data', (data) => {
      // Read a market data packet
      data.copy(buffer);
      const bytesRead = data.length;

      // Process the market data packet
      var fin =processMarketDataPacket(buffer, bytesRead);
      // const jsonData = buffer.toString('utf8', 4, buffer.length);
      // const parsedData = JSON.parse(jsonData);
      // res.json({data:jsonData})
      // console.log(jsonData);
    });

    // Handle the end of the socket connection
    socket.on('end', () => {
      console.log('Disconnected from the server');
      res.send('Socket connection closed');
    });

    // Handle socket errors
    socket.on('end', () => {
        console.log('Disconnected from the server');
        res.send('Socket connection closed');
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})


function processMarketDataPacket(packetData, packetSize) {
    // Extract relevant fields from the packet
    const tradingSymbol = packetData.toString('utf8', 4, 34).replace(/\s/g, '');
    const sequenceNumber = getLongFromLittleEndian(packetData, 34);
    const timeStamp = getLongFromLittleEndian(packetData, 42);
    const lastTradedPrice = getLongFromLittleEndian(packetData, 50);
    const lastTradedQuantity = getLongFromLittleEndian(packetData, 58);
    const totalTradedVolume = getLongFromLittleEndian(packetData, 66);
    const bestBid = getLongFromLittleEndian(packetData, 74);
    const bestBidQty = getLongFromLittleEndian(packetData, 82);
    const bestAsk = getLongFromLittleEndian(packetData, 90);
    const bestAskQty = getLongFromLittleEndian(packetData, 98);
    const openInterest = getLongFromLittleEndian(packetData, 106);
    const prevClosePrice = getLongFromLittleEndian(packetData, 114);
    const prevOpenInterest = getLongFromLittleEndian(packetData, 122);
    let option = '';
    
    // Extract other fields as needed
    if (tradingSymbol.endsWith('CE')) {
      option = 'Call';
    } else if (tradingSymbol.endsWith('PE')) {
      option = 'Put';
    }
    //Index
    var a="ALLBANKS";
    var b="MAINIDX";
    var c="FINANCIAL";
    var d="MIDCAPS";

    var len_symbol=tradingSymbol.length;

    var index="";

    if(tradingSymbol.startsWith(a))
    {   
        index=a;
    }
    else if(tradingSymbol.startsWith(b))
    {
        index=b;
    }
    else if(tradingSymbol.startsWith(c))
    {
        index=c;
    }
    else if(tradingSymbol.startsWith(d))
    {
        index=d;   
    }

    //to check why array out of bound exception

    //expiry date
    
    var expiryDate=tradingSymbol.substring(index.length,index.length+7);

    //strike price
    var strikePriceStr = tradingSymbol.slice(index.length+7,tradingSymbol.length).replace ( /[^0-9]/g, '' );
    var strikePriceInt = parseInt(strikePriceStr);
    
    // long strikePrice=Long.parseLong(strikePriceStr);
    
    // Do further processing or display the extracted data
    console.log('Symbol:', tradingSymbol);
    console.log("Index: ",index);
    console.log("Expiry Date: ",expiryDate);
    console.log("Strike Price: ",strikePriceInt);
    console.log('Time Stamp:', timeStamp);
    console.log('Sequence:', sequenceNumber);
    console.log('Last Traded Price:', lastTradedPrice);
    console.log('Total Traded Volume:', totalTradedVolume);
    console.log('Best Bid:', bestBid);
    console.log('Best Ask:', bestAsk);
    console.log('Best Bid Quantity:', bestBidQty);
    console.log('Best Ask Quantity:', bestAskQty);
    console.log('Open Interest:', openInterest);
    console.log('Previous Close Price:', prevClosePrice);
    console.log('Previous Open Interest:', prevOpenInterest);
    console.log("");
    
    // Implement the rest of the processing logic as needed
  }
  
  function getLongFromLittleEndian(data, offset) {
    let value = 0;
    for (let i = 7; i >= 0; i--) {
      value <<= 8;
      value |= (data[offset + i] & 0xff);
    }
    return value;
  }