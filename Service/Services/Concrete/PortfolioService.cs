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
              
            //var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
           ///cb94223b-ccb8-4f2f-93d7-0df96a7f065c
           var userId="cb94223b-ccb8-4f2f-93d7-0df96a7f065c";

           //find user email
              //var userEmail = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Email).Value;
            var userEmail = "superadmin@gmail.com";


            var portfolio = _mapper.Map<Portfolio>(portfolioCreateDto);
            portfolio.UserId = Guid.Parse(userId);
            portfolio.CreatedBy = userEmail;
            await _portfolioRepository.AddAsync(portfolio);
            await _unitOfWork.SaveAsync();
        }
        //find stock holding value and check user balance if it is enough then add stock holding to portfolio
        public async Task UpdatePortfolioAsync(PortfolioUpdateDto portfolioUpdateDto)
        {
            //control that this portfolio belongs to the user
            //var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
           ///cb94223b-ccb8-4f2f-93d7-0df96a7f065c
           var userId="cb94223b-ccb8-4f2f-93d7-0df96a7f065c";
           
            var portfolio = await _portfolioRepository.GetAsync(p => p.UserId == Guid.Parse(userId), p => p.StockHoldings, p => p.AppUser);
            
            //var portfolio = await _portfolioRepository.GetByGuidAsync(portfolioUpdateDto.Id);
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
