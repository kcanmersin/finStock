using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using api.Interfaces;
using api.Models;
using api.Mappers;
using api.Helpers;

namespace api.Service
{
    public class FMPService : IFMPService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public FMPService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<Stock> FindStockBySymbolAsync(string symbol)
        {
            try
            {
                var uri = $"https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={_config["FMPKey"]}";
                var result = await _httpClient.GetAsync(uri);
                if (result.IsSuccessStatusCode)
                {
                    var content = await result.Content.ReadAsStringAsync();
                    var tasks = JsonConvert.DeserializeObject<Dtos.Stock.FMPStock[]>(content);
                    var stock = tasks.FirstOrDefault();
                    return stock != null ? stock.ToStockFromFMP() : null;
                }
                return null;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error in FindStockBySymbolAsync: {e.Message}");
                return null;
            }
        }

        public async Task<List<Stock>> GetAdditionalStocksInfo(QueryObject query)
        {
            var uri = $"https://financialmodelingprep.com/api/v3/quote/{query.Symbol}?apikey={_config["FMPKey"]}";
            return await GetApiData<List<Stock>>(uri, "additional stocks info");
        }

        public async Task<List<Stock>> GetSymbolListAsync()
        {
            var uri = $"https://financialmodelingprep.com/api/v3/stock/list?apikey={_config["FMPKey"]}";
            return await GetApiData<List<Stock>>(uri, "symbol list");
        }

       public async Task<List<Stock>> GeneralSearchAsync(string query)
{
    var uri = $"https://financialmodelingprep.com/api/v3/search?query={query}&apikey={_config["FMPKey"]}";
    var fmpStocks = await GetApiData<Dtos.Stock.FMPStock[]>(uri, "general search");

    if (fmpStocks != null)
    {
        return fmpStocks.Select(fmpStock => fmpStock.ToStockFromFMP()).ToList();
    }

    return new List<Stock>();
}


        public async Task<List<Stock>> NameSearchAsync(string companyName)
        {
            var uri = $"https://financialmodelingprep.com/api/v3/search-ticker?query={companyName}&apikey={_config["FMPKey"]}";
            return await GetApiData<List<Stock>>(uri, "name search");
        }

        private async Task<T> GetApiData<T>(string uri, string dataType)
        {
            try
            {
                var response = await _httpClient.GetAsync(uri);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<T>(content);
                }
                else
                {
                    Console.WriteLine($"Failed to fetch {dataType} from FMP API.");
                    return default;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error fetching {dataType}: {e.Message}");
                return default;
            }
        }
    }
}
