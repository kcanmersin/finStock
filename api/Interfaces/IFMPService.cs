using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Helpers;
using api.Models;

namespace api.Interfaces
{
    public interface IFMPService
    {
        // Finds a stock by its symbol using the Financial Modeling Prep API.
        Task<Stock> FindStockBySymbolAsync(string symbol);

        // Gets additional stocks information based on a query object.
        Task<List<Stock>> GetAdditionalStocksInfo(QueryObject query);

        // Retrieves a list of all stock symbols available in the Financial Modeling Prep API.
        Task<List<Stock>> GetSymbolListAsync();

        // Performs a general search in the Financial Modeling Prep API using a query string.
        Task<List<Stock>> GeneralSearchAsync(string query);

        // Searches for stocks by company name in the Financial Modeling Prep API.
        Task<List<Stock>> NameSearchAsync(string companyName);
    }
}
