using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Entity.DTOs.StockHolding;

namespace Service.Services.Abstractions
{
    public interface IStockHoldingService
    {
        Task<PortfolioDto> GetUserStockHoldingsAsync();
    }
}
