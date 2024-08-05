using Entity.Entities.Stock;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Entity.DTOs.Portfolio;

namespace Service.Services.Abstractions
{
public interface IPortfolioService
    {
        Task<List<PortfolioDto>> GetAllPortfoliosAsync();
        Task<PortfolioDto> GetPortfolioByUserIdAsync(Guid userId);
        Task<PortfolioDto> GetPortfolioByIdAsync(Guid portfolioId);
        Task AddPortfolioAsync(PortfolioCreateDto portfolioCreateDto);
        Task UpdatePortfolioAsync(PortfolioUpdateDto portfolioUpdateDto);
        Task DeletePortfolioAsync(Guid portfolioId);
        Task<bool> PortfolioExistsAsync(Guid portfolioId);
    }
}
