
const net = require('net');
const SERVER_HOST = 'localhost';
const SERVER_PORT = 9011;
const { DateTime } = require('luxon');
const { normal } = require('jstat');

// function calculate_d1_d2(S, K, r, T, sigma) {
//   const d1 = (Math.log(S / K) + (r + (sigma**2) / 2) * T) / (sigma * Math.sqrt(T));
//   const d2 = d1 - sigma * Math.sqrt(T);
//   return [d1, d2];
// }

// function calculate_implied_volatility(S, K, r, T, option_price, option_type) {
//   const epsilon = 0.5;
//   const max_iterations = 100;

//   let sigma = 0.5;

//   for (let i = 0; i < max_iterations; i++) {
//     const [d1, d2] = calculate_d1_d2(S, K, r, T, sigma);

//     let option_price_calculated;
//     if (option_type.toLowerCase() === 'call') {
//       option_price_calculated = S * normal.cdf(d1) - K * Math.exp(-r * T) * normal.cdf(d2);
//     } else if (option_type.toLowerCase() === 'put') {
//       option_price_calculated = K * Math.exp(-r * T) * normal.cdf(-d2) - S * normal.cdf(-d1);
//     } else {
//       throw new Error("Invalid option type. Please specify 'call' or 'put'.");
//     }

//     const diff = option_price_calculated - option_price;

//     if (Math.abs(diff) < epsilon) {
//       return sigma;
//     }

//     const vega = S * normal.pdf(d1) * Math.sqrt(T);
//     sigma -= diff / vega;
//   }

//   throw new Error("Implied volatility calculation did not converge.");
// }

// // Example usage
// const S = 50; // Underlying price
// const K = 55; // Strike price
// const r = 0.05; // Risk-free interest rate (5% as given)
// const expiry_date_str = '04JUL23'; // Expiry date
// const expiry_date = DateTime.fromFormat(expiry_date_str, "ddMMMyy");
// const T = (expiry_date.diffNow('days').days) / 365; // Time to expiry in years
// const option_price = 50; // Option price (LTP)
// const option_type = 'call'; // Option type ('call' or 'put')

// const implied_volatility = calculate_implied_volatility(S, K, r, T, option_price, option_type);
// console.log("Implied Volatility:", implied_volatility);



function processMarketDataPacket(packetData, packetSize) {
    // Extract relevant fields from the packet
    const tradingSymbol = packetData.toString('utf8', 4, 34).replaceAll('\x00','');
    const sequenceNumber = getLongFromLittleEndian(packetData, 34);
    const timeStamp = getLongFromLittleEndian(packetData, 42);
    const epochTime = new Date(timeStamp * 1000);
    const lastTradedPrice = getLongFromLittleEndian(packetData, 50) / 100;
    const lastTradedQuantity = getLongFromLittleEndian(packetData, 58);
    const totalTradedVolume = getLongFromLittleEndian(packetData, 66);
    const bestBid = getLongFromLittleEndian(packetData, 74) / 100;
    const bestBidQty = getLongFromLittleEndian(packetData, 82);
    const bestAsk = getLongFromLittleEndian(packetData, 90) / 100;
    const bestAskQty = getLongFromLittleEndian(packetData, 98);
    const openInterest = getLongFromLittleEndian(packetData, 106);
    const prevClosePrice = getLongFromLittleEndian(packetData, 114) / 100;
    const prevOpenInterest = getLongFromLittleEndian(packetData, 122);

    
    //Index
    var a = "ALLBANKS";
    var b = "MAINIDX";
    var c = "FINANCIAL";
    var d = "MIDCAPS";

    var len_symbol = tradingSymbol.length;

    var index = "";

    if (tradingSymbol.startsWith(a)) {
        index = a;
    } else if (tradingSymbol.startsWith(b)) {
        index = b;
    } else if (tradingSymbol.startsWith(c)) {
        index = c;
    } else if (tradingSymbol.startsWith(d)) {
        index = d;
    }

    //to check why array out of bound exception

    //expiry date

    var expiryDate = tradingSymbol.substring(index.length, index.length + 7);

    //strike price
    var strikePriceStr = tradingSymbol.slice(index.length + 7, tradingSymbol.length).replace(/[^0-9]/g, '');
    var strikePriceInt = parseInt(strikePriceStr);
    var options = tradingSymbol.slice(index.length + 7, tradingSymbol.length).replace(/[^A-Z]/g, '');
    let option = '';
 
    // Extract other fields as needed
    if (options == 'CE') {
        option = 'Call';
    } else if (options == 'PE') {
        option = 'Put';
    }
    //change in oi
    var chngInOI = openInterest - prevOpenInterest;

    //time to maturity

    const now = new Date(); // Current date and time
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30); // Set time to 15:30

    const exp1530epoch = Math.floor(targetTime.getTime() / 1000); // Convert to epoch time in seconds


    // var timeToMaturity = (exp1530epoch - epochTime)<0?0:exp1530epoch - epochTime;
    var timeToMaturity = exp1530epoch - epochTime
    // if(option!==''){

    //     var implied_volatility = calculate_implied_volatility(bestBid,bestAsk , 0.05,timeToMaturity , lastTradedPrice, option);
    // }
    // Do further processing or display the extracted data
    const data ={
        "Symbol": tradingSymbol,
        "Option": option,
        "Index  ": index,
        "Expiry Date": expiryDate,
        "Strike Price":strikePriceInt,
        "Time Stamp":timeStamp,
        "Time Stamp in epoch":epochTime,
        "Time to Maturity": timeToMaturity,
        "Sequence":sequenceNumber,
        "Last Traded Price": lastTradedPrice,
        "Total Traded Volume":totalTradedVolume,
        "Best Bid":bestBid,
        "Best Ask":bestAsk,
        "Best Bid Quantity":bestBidQty,
        "Open Interest":openInterest,
        "Previous Close Price":prevClosePrice,
        "Previous Open Interest": prevOpenInterest,
        "Change in OI":chngInOI

    }
    // console.log(data);
    return data
    // console.log('Symbol:', tradingSymbol);
    // console.log("Option: ",option);
    // console.log("Index: ", index);
    // console.log("Expiry Date: ", expiryDate);
    // console.log("Strike Price: ", strikePriceInt);
    // console.log('Time Stamp:', timeStamp);
    // console.log("Time Stamp in epoch: ", epochTime);
    // console.log("Time to Maturity: ",timeToMaturity);
    // console.log('Sequence:', sequenceNumber);
    // console.log('Last Traded Price:', lastTradedPrice);
    // console.log('Total Traded Volume:', totalTradedVolume);
    // console.log('Best Bid:', bestBid);
    // console.log('Best Ask:', bestAsk);
    // console.log('Best Bid Quantity:', bestBidQty);
    // console.log('Best Ask Quantity:', bestAskQty);
    // console.log('Open Interest:', openInterest);
    // console.log('Previous Close Price:', prevClosePrice);
    // console.log('Previous Open Interest:', prevOpenInterest);
    // console.log("Change in OI: ", chngInOI);
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

function socketConnection(){

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
        const fin = processMarketDataPacket(buffer, bytesRead);
        // const jsonData = buffer.toString('utf8', 4, bytesRead);
        // const parsedData = JSON.parse(jsonData);
        // console.log(parsedData)
        // console.log(fin);
        return fin
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
  }
module.exports ={socketConnection};