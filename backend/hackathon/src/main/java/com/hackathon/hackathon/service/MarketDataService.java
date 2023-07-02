package com.hackathon.hackathon.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hackathon.hackathon.model.MarketData;

@Service
public class MarketDataService {

    private static final String SERVER_HOST = "localhost";
    private static final int SERVER_PORT = 9010;

    public List<MarketData> getMarketData() {
        List<MarketData> marketDataList = new ArrayList<>();

        try {
            Socket socket = new Socket(SERVER_HOST, SERVER_PORT);
            System.out.println("Connected to the server on port "+SERVER_PORT);

            // Send an initial request packet
            OutputStream outputStream = socket.getOutputStream();
            outputStream.write(1); // Send a single byte as the initial request
            System.out.println("Initial request sent");

            // Receive and process market data packets
            InputStream inputStream = socket.getInputStream();
            byte[] buffer = new byte[130]; // market data packet size is 130 bytes
            while (true) {
                // Read a market data packet
                int bytesRead = inputStream.read(buffer);
                if (bytesRead == -1) {
                    break; // End of stream
                }

                // Process the market data packet
                processMarketDataPacket(buffer, bytesRead);
            }

            // Close the socket
            socket.close();
            System.out.println("Disconnected from the server");
        } catch (IOException e) {
            e.printStackTrace();
        }

        return marketDataList;
    }

    // Other helper methods (processMarketDataPacket, getLongFromLittleEndian, calculateImpliedVolatility)...
    private static void processMarketDataPacket(byte[] packetData, int packetSize) {
        
        // Extract relevant fields from the packet
        String tradingSymbol = new String(packetData, 4, 30).trim();
        long sequenceNumber = getLongFromLittleEndian(packetData, 34);
        long timeStamp = getLongFromLittleEndian(packetData, 42);
        long lastTradedPrice = getLongFromLittleEndian(packetData, 50);
        long lastTradedQuantity = getLongFromLittleEndian(packetData, 58);
        long totalTradedVolume = getLongFromLittleEndian(packetData, 66);
        long bestBid=getLongFromLittleEndian(packetData, 74);
        long bestBidQty=getLongFromLittleEndian(packetData, 82);
        long bestAsk=getLongFromLittleEndian(packetData, 90);
        long bestAskQty=getLongFromLittleEndian(packetData, 98);
        long openInterest=getLongFromLittleEndian(packetData, 106);
        long prevClosePrice=getLongFromLittleEndian(packetData, 114);
        long prevOpenInterest=getLongFromLittleEndian(packetData, 122);
        String option="";

        // Extract other fields as needed

        //Option-type
        if(tradingSymbol.endsWith("CE"))
        {
            option="Call";
        }
        else if(tradingSymbol.endsWith("PE"))
        {
            option="Put";
        }

        //Index
        String a="ALLBANKS";
        String b="MAINIDX";
        String c="FINANCIAL";
        String d="MIDCAPS";

        int len_symbol=tradingSymbol.length();

        String index="";

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
        // String expiryDate=tradingSymbol.substring(index.length(),index.length()+7);
        

        //strike price
        // String strikePriceStr=tradingSymbol.substring(index.length()+7,len_symbol-2);
        // long strikePrice=Long.parseLong(strikePriceStr);
        

        // Calculate implied volatility (IV) using the Black Scholes formula
        double impliedVolatility = calculateImpliedVolatility(lastTradedPrice, lastTradedQuantity);

        // Do further processing or display the calculated IV
        
        System.out.println("Symbol: " + tradingSymbol);
        System.out.println("Index: "+index);
        //System.out.println("Expiry Date: "+expiryDate);
        //System.out.println("Strike Price: "+strikePrice);
        System.out.println("Option: "+option);
        System.out.println("Time Stamp: "+timeStamp);
        System.out.println("Sequence: "+sequenceNumber);
        System.out.println("Last Traded Price: " + lastTradedPrice);
        System.out.println("Total Traded Volume: "+totalTradedVolume);
        System.out.println("Best Bid: "+bestBid);
        System.out.println("Best Ask: "+bestAsk);
        System.out.println("Best Bid Quantity: "+bestBidQty);
        System.out.println("Best Ask Quantity: "+bestAskQty);
        System.out.println("Open Interest: "+openInterest);
        System.out.println("Previous Close Price: "+prevClosePrice);
        System.out.println("Previous Open Interest: "+prevOpenInterest);
        System.out.println("Implied Volatility: " + impliedVolatility);
        System.out.println();
    }

    private static long getLongFromLittleEndian(byte[] data, int offset) {
        long value = 0;
        for (int i = 7; i >= 0; i--) {
            value <<= 8;
            value |= (data[offset + i] & 0xFF);
        }
        return value;
    }

    private static double calculateImpliedVolatility(long lastTradedPrice, long lastTradedQuantity) {
        // Implement the Black Scholes formula here
        // Use the received market data to calculate the implied volatility (IV)
        // Return the calculated IV
        return 0.0; // Placeholder value, replace with the actual calculation
    }
}