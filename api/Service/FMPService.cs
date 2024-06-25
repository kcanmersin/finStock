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
            var uri = $"https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={_config["FMPKey"]}";
            return await GetApiData<Dtos.Stock.FMPStock[]>(uri, "stock by symbol").ContinueWith(task =>
            {
                var stocks = task.Result;
                return stocks?.FirstOrDefault()?.ToStockFromFMP();
            });
        }

        public async Task<List<Stock>> GetAdditionalStocksInfo(QueryObject query)
        {
            var uri = $"https://financialmodelingprep.com/api/v3/quote/{query.Symbol}?apikey={_config["FMPKey"]}";
            return await GetStockListFromFMP(uri, "additional stocks info");
        }

        public async Task<List<Stock>> GetSymbolListAsync()
        {
            var uri = $"https://financialmodelingprep.com/api/v3/stock/list?apikey={_config["FMPKey"]}";
            return await GetStockListFromFMP(uri, "symbol list");
        }

        public async Task<List<Stock>> GeneralSearchAsync(string query)
        {
            var uri = $"https://financialmodelingprep.com/api/v3/search?query={query}&apikey={_config["FMPKey"]}";
            return await GetStockListFromFMP(uri, "general search");
        }

        public async Task<List<Stock>> NameSearchAsync(string companyName)
        {
            var uri = $"https://financialmodelingprep.com/api/v3/search-ticker?query={companyName}&apikey={_config["FMPKey"]}";
            return await GetStockListFromFMP(uri, "name search");
        }

        private async Task<List<Stock>> GetStockListFromFMP(string uri, string dataType)
        {
            return await GetApiData<Dtos.Stock.FMPStock[]>(uri, dataType).ContinueWith(task =>
            {
                var fmpStocks = task.Result;
                return fmpStocks?.Select(fmpStock => fmpStock.ToStockFromFMP()).ToList() ?? new List<Stock>();
            });
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
