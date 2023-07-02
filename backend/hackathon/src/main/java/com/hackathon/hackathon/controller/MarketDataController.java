package com.hackathon.hackathon.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hackathon.hackathon.model.MarketData;
import com.hackathon.hackathon.service.MarketDataService;

import java.util.List;

@RestController
@RequestMapping("/marketdata")
public class MarketDataController {

    private final MarketDataService marketDataService;

    @Autowired
    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    @GetMapping
    public List<MarketData> getMarketData() {
        return marketDataService.getMarketData();
    }
}