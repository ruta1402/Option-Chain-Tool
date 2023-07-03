const net = require('net');
const SERVER_HOST = 'localhost';
const SERVER_PORT = 9011;
const { DateTime } = require('luxon');
const { normal } = require('jstat');
const socketIO = require('socket.io');

const BlackScholes = require('black-scholes');

// Set the inputs
const optionPrice = 10.0; // Replace with the actual option price
const underlyingPrice = 100.0; // Replace with the current underlying asset price
const strikePrice = 95.0; // Replace with the option's strike price
const timeToExpiration = 0.5; // Replace with the time to expiration in years
const riskFreeRate = 0.05; // Replace with the risk-free interest rate

// Calculate implied volatility
const impliedVolatility = BlackScholes.impliedVolatility(
    optionPrice,
    underlyingPrice,
    strikePrice,
    timeToExpiration,
    riskFreeRate
);

// Output the result
console.log('Implied Volatility:', impliedVolatility);




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

var ida = 0
var idb = 0
var idc = 0
var idd = 0



function processMarketDataPacket(packetData, packetSize) {
    // Extract relevant fields from the packet
    const tradingSymbol = packetData.toString('utf8', 4, 34).replaceAll('\x00', '');
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
    var c = "FINANCIALS";
    var d = "MIDCAPS";

    var len_symbol = tradingSymbol.length;

    var index = "";

    var id;
    if (tradingSymbol.startsWith(a)) {
        index = a;
        id = ida++
    } else if (tradingSymbol.startsWith(b)) {
        index = b;
        id = idb++
    } else if (tradingSymbol.startsWith(c)) {
        index = c;
        id = idc++
    } else if (tradingSymbol.startsWith(d)) {
        index = d;
        id = idd++
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


    const data = {
            "id": id,
            "Symbol": tradingSymbol,
            "Option": option,
            "Index": index,
            "Expiry_Date": expiryDate,
            "Strike_Price": strikePriceInt,
            "Time_Stamp": timeStamp,
            "Time_Stamp_in_epoch": epochTime,
            "Time_to_Maturity": timeToMaturity,
            "Sequence": sequenceNumber,
            "Last_Traded_Price": lastTradedPrice,
            "Total_Traded_Volume": totalTradedVolume,
            "Best_Bid": bestBid,
            "Best_Ask": bestAsk,
            "Best_Bid_Quantity": bestBidQty,
            "Open_Interest": openInterest,
            "Previous_Close_Price": prevClosePrice,
            "Previous_Open_Interest": prevOpenInterest,
            "Change_in_OI": chngInOI

        }
        // console.log(data);
    return data


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

function socketConnection(server) {

    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ['GET', "POST"],
        }
    });

    io.on('connection', (socket2) => {


        // Send data to the client

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
                socket2.emit('data', fin);
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
}
module.exports = { socketConnection };