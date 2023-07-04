const net = require('net');
const SERVER_HOST = 'localhost';
const SERVER_PORT = 9011;
const { DateTime } = require('luxon');
const { normal } = require('jstat');
const socketIO = require('socket.io');

const bs = require("black-scholes");

var ida = 0
var idb = 0
var idc = 0
var idd = 0

function processMarketDataPacket(packetData, packetSize) {

    // Extract relevant fields from the packet
    const tradingSymbol = packetData.toString('utf8', 4, 34).replaceAll('\x00', '');
    const sequenceNumber = getLongFromLittleEndian(packetData, 34);
    const timeStamp = getLongFromLittleEndian(packetData, 42); //this is already epoch time
    const date_ = new Date(timeStamp * 1000);
    const year = date_.getFullYear();
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
    //End of extract relevant fields from the packet

    // console.log(timeStamp);
    //Extract Index
    var a = "ALLBANKS";
    var b = "MAINIDX";
    var c = "FINANCIALS";
    var d = "MIDCAPS";

    var len_symbol = tradingSymbol.length;

    var index = "";
    let opt_pr;

    var id;
    if (tradingSymbol.startsWith(a)) {
        index = a;
        opt_pr = 43982.50;
        id = ida++
    } else if (tradingSymbol.startsWith(b)) {
        index = b;
        opt_pr = 18548.80;
        id = idb++
    } else if (tradingSymbol.startsWith(c)) {
        index = c;
        opt_pr = 19403.60;
        id = idc++
    } else if (tradingSymbol.startsWith(d)) {
        index = d;
        opt_pr = 7856.50;
        id = idd++
    }
    //End of extract index

    //check for option price
    if (index.length == tradingSymbol.length) {
        optn_pr = lastTradedPrice;
    }

    //Extract expiry date
    var expiryDate = tradingSymbol.substring(index.length, index.length + 7);

    var month = expiryDate.substring(2, 5);

    var date = parseInt(expiryDate.substring(0, 2));

    const monthNames = {
        0: 'JAN',
        1: 'FEB',
        2: 'MAR',
        3: 'APR',
        4: 'MAY',
        5: 'JUN',
        6: 'JUL',
        7: 'AUG',
        8: 'SEP',
        9: 'OCT',
        10: 'NOV',
        11: 'DEC'
    };

    let targetMonth = null;

    for (const key in monthNames) {
        if (monthNames[key] === month) {
            targetMonth = parseInt(key);
            break;
        }
    }

    let targetYear
    if (expiryDate.endsWith("23")) {
        targetYear = 2023;
    } else if (expiryDate.endsWith("24")) {
        targetYear = 2024;
    } else if (expiryDate.endsWith("25")) {
        targetYear = 2025;
    } else if (expiryDate.endsWith("26")) {
        targetYear = 2026;
    } else if (expiryDate.endsWith("27")) {
        targetYear = 2027;
    }
    //End of extract expiry date



    //calculate epoch of expiry date
    const expiry_Date = new Date(targetYear, targetMonth, date, 15, 30);
    const epochTimeExpiry = Math.floor(expiry_Date.getTime());
    //End of epoch expiry 


    //time to maturity
    //var timeToMaturity = epochTimeExpiry - timeStamp;
    var timeToMaturity = targetYear - year;



    //strike price
    var strikePriceStr = tradingSymbol.slice(index.length + 7, tradingSymbol.length).replace(/[^0-9]/g, '');
    var strikePriceInt = parseInt(strikePriceStr);
    var options = tradingSymbol.slice(index.length + 7, tradingSymbol.length).replace(/[^A-Z]/g, '');
    let option = '';

    //Extract option type
    if (options == 'CE') {
        option = 'call';
    } else if (options == 'PE') {
        option = 'put';
    }

    //change in oi
    var chngInOI = openInterest - prevOpenInterest;


    //implied volatilty
    // Set the inputs
    const optionPrice = opt_pr; //10.0; // Replace with the actual option price
    const underlyingPrice = lastTradedPrice; // Replace with the current underlying asset price
    const strikePrice = strikePriceInt; // Replace with the option's strike price
    const timeToExpiration = timeToMaturity; // Replace with the time to expiration in years
    const riskFreeRate = 0.05; // Replace with the risk-free interest rate

    // Calculate implied volatility
    // const impliedVolatility = bs.blackScholes(
    //     optionPrice,
    //     underlyingPrice,
    //     strikePrice,
    //     timeToExpiration,
    //     0.05,
    //     option
    // );

    const impliedVolatility = calculateImpliedVolatility(optionPrice, underlyingPrice, strikePrice, timeToExpiration, riskFreeRate, option);


    const data = {
        "id": id,
        "Symbol": tradingSymbol,
        "Option": option,
        "Index": index,
        "Expiry_Date": expiryDate,
        "Strike_Price": strikePriceInt,
        "Time_Stamp": timeStamp,
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
        "Change_in_OI": chngInOI,
        "Last_Traded_Quantity": lastTradedQuantity,
        "Best_Ask_Quantity": bestAskQty,
        "Implied_Volatility": impliedVolatility

    }
    console.log(impliedVolatility);
    return data

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