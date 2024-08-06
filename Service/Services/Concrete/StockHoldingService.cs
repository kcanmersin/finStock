using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Data.Repositories.Abstractions;
using Entity.DTOs.StockHolding;
using Entity.Entities.Stock;
using Microsoft.AspNetCore.Http;
using Service.ExternalAPI;
using Service.Services.Abstractions;

namespace Service.Services.Concrete
{
    public class StockHoldingService : IStockHoldingService
    {
        private readonly IRepository<StockHolding> _stockHoldingRepository;
        private readonly IStockApiService _stockApiService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public StockHoldingService(
            IRepository<StockHolding> stockHoldingRepository, 
            IStockApiService stockApiService, 
            IMapper mapper, 
            IHttpContextAccessor httpContextAccessor)
        {
            _stockHoldingRepository = stockHoldingRepository;
            _stockApiService = stockApiService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<PortfolioDto> GetUserStockHoldingsAsync()
        {
            var userId = Guid.Parse("cb94223b-ccb8-4f2f-93d7-0df96a7f065c"); // Replace with actual user ID retrieval logic

            var holdings = await _stockHoldingRepository.GetAllAsync(sh => sh.UserId == userId);
            var holdingDtos = new List<StockHoldingDto>();

            foreach (var holding in holdings)
            {
                var currentPrice = await _stockApiService.GetStockPriceAsync(holding.StockSymbol);
                var stockHoldingDto = _mapper.Map<StockHoldingDto>(holding);
                stockHoldingDto.CurrentPrice = currentPrice;
                stockHoldingDto.TotalValue = holding.Quantity * currentPrice;

                holdingDtos.Add(stockHoldingDto);
            }

            var portfolioDto = new PortfolioDto
            {
                StockHoldings = holdingDtos
            };

            return portfolioDto;
        }
    }
}
