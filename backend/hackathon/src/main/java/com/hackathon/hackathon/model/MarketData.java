package com.hackathon.hackathon.model;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class MarketData {
    private String symbol;
    private String index;
    private String option;
    private long timeStamp;
    private long sequenceNumber;
    private long lastTradedPrice;
    private long totalTradedVolume;
    private long bestBid;
    private long bestAsk;
    private long bestBidQty;
    private long bestAskQty;
    private long openInterest;
    private long prevClosePrice;
    private long prevOpenInterest;
    private double impliedVolatility;
}
