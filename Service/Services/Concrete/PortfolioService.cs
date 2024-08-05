using AutoMapper;
using Data.Repositories.Abstractions;
using Data.UnitOfWorks;
using Entity.DTOs.Portfolio;
using Entity.Entities.Stock;
using Microsoft.AspNetCore.Http;
using Service.Services.Abstractions;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Service.Services.Concrete
{
    public class PortfolioService : IPortfolioService
    {
        private readonly IRepository<Portfolio> _portfolioRepository;
        private readonly IRepository<StockHolding> _stockHoldingRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public PortfolioService(
            IRepository<Portfolio> portfolioRepository,
            IRepository<StockHolding> stockHoldingRepository,
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContextAccessor,
            IMapper mapper)
        {
            _portfolioRepository = portfolioRepository;
            _stockHoldingRepository = stockHoldingRepository;
            _unitOfWork = unitOfWork;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }

        public async Task<List<PortfolioDto>> GetAllPortfoliosAsync()
        {
            var portfolios = await _portfolioRepository.GetAllAsync();
            return _mapper.Map<List<PortfolioDto>>(portfolios);
        }

        public async Task<PortfolioDto> GetPortfolioByUserIdAsync(Guid userId)
        {
            var portfolio = await _portfolioRepository.GetAsync(p => p.UserId == userId, p => p.StockHoldings, p => p.AppUser);

            if (portfolio == null) return null;

            return _mapper.Map<PortfolioDto>(portfolio);
        }

        public async Task<PortfolioDto> GetPortfolioByIdAsync(Guid portfolioId)
        {
            var portfolio = await _portfolioRepository.GetByGuidAsync(portfolioId);

            if (portfolio == null) return null;

            return _mapper.Map<PortfolioDto>(portfolio);
        }

        public async Task AddPortfolioAsync(PortfolioCreateDto portfolioCreateDto)
        {
            var portfolio = _mapper.Map<Portfolio>(portfolioCreateDto);

            await _portfolioRepository.AddAsync(portfolio);
            await _unitOfWork.SaveAsync();
        }

        public async Task UpdatePortfolioAsync(PortfolioUpdateDto portfolioUpdateDto)
        {
            var portfolio = await _portfolioRepository.GetByGuidAsync(portfolioUpdateDto.Id);
            if (portfolio != null)
            {
                _mapper.Map(portfolioUpdateDto, portfolio);
                await _portfolioRepository.UpdateAsync(portfolio);
                await _unitOfWork.SaveAsync();
            }
        }

        public async Task DeletePortfolioAsync(Guid portfolioId)
        {
            var portfolio = await _portfolioRepository.GetByGuidAsync(portfolioId);
            if (portfolio != null)
            {
                await _portfolioRepository.DeleteAsync(portfolio);
                await _unitOfWork.SaveAsync();
            }
        }

        public async Task<bool> PortfolioExistsAsync(Guid portfolioId)
        {
            return await _portfolioRepository.AnyAsync(p => p.Id == portfolioId);
        }
    }
}
