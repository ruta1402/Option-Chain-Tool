import React, {useEffect,useState} from 'react'
// const io = require('socket.io-client');
const SERVER_HOST = 'localhost';
const SERVER_PORT = 9011;
const net = require('net');

export default function Socket() {
  
  //   useEffect(() => {
  //     const socket = io('http://localhost:9011');
      
  //     socket.on('connect', () => {
  //       console.log('Socket connected');
  
  //       // Send an initial request packet
  //       socket.emit('initialRequest', 1);
  //       console.log('Initial request sent');
  //     });
  
  //     socket.on('marketData', (data) => {
  //       // Process the market data packet
  //       processMarketDataPacket(data);
  //     });
  
  //     socket.on('disconnect', () => {
  //       console.log('Socket disconnected');
  //     });
  
  //     return () => {
  //       socket.disconnect();
  //     };
  //   }, []);
  
  //   function processMarketDataPacket(data) {
  //     // Process the market data packet
  //     console.log('Received market data packet:', data);
  //   }
  
  // function processMarketDataPacket(data) {
  //   // Process the market data packet
  //   console.log('Received market data packet:', data);
  // }

  useEffect(()=>{
    const socket = new net.Socket();
    socket.connect(SERVER_PORT, SERVER_HOST, () => {
      console.log(`Connected to the server on port ${SERVER_PORT}`);

      // Send an initial request packet
      socket.write(Buffer.from([1])); // Send a single byte as the initial request
      console.log('Initial request sent');
    });
    const buffer = Buffer.alloc(130); // market data packet size is 130 bytes
    socket.on('data', (data) => {
      // Read a market data packet
      data.copy(buffer);
      const bytesRead = data.length;

      // Process the market data packet
      processMarketDataPacket(buffer, bytesRead);
      
    });
    socket.on('end', () => {
      console.log('Disconnected from the server');
      
    });


  },[])
  function processMarketDataPacket(packetData, packetSize) {
    // Extract relevant fields from the packet
    const tradingSymbol = packetData.toString('utf8', 4, 34).trim();
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
  
    // Do further processing or display the extracted data
    console.log('Symbol:', tradingSymbol);
    console.log('Option:', option);
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
    console.log();
  
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
  return (
    <div>Your component content here</div>
  )
}
