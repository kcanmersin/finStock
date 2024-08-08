﻿using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Service.ExternalAPI;

public class StockApiService : IStockApiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public StockApiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["StockApiSettings:ApiKey"]; 
    }

    public async Task<decimal> GetStockPriceAsync(string symbol)
    {
        var requestUri = $"quote?symbol={symbol}&token={_apiKey}";

        var response = await _httpClient.GetAsync(requestUri);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var stockData = JsonSerializer.Deserialize<StockApiResponse>(content);

        return stockData?.c ?? 0;
    }
    //TO DO: add other methods for calculate the daily profit-loss 
}

public class StockApiResponse
{
    public decimal c { get; set; } // Current price
    public decimal d { get; set; } // Change
    public decimal dp { get; set; } // Percent change
    public decimal h { get; set; } // High price of the day
    public decimal l { get; set; } // Low price of the day
    public decimal o { get; set; } // Open price of the day
    public decimal pc { get; set; } // Previous close price
}
