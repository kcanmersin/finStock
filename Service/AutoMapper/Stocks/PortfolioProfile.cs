using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Entity.DTOs.Portfolio;
using Entity.DTOs.StockHolding;
using Entity.Entities.Stock;

namespace Service.AutoMapper.Stocks
{
 public class PortfolioProfile : Profile
    {
        public PortfolioProfile()
        {
            CreateMap<Portfolio, PortfolioDto>()
                //.ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.StockHoldings, opt => opt.MapFrom(src => src.StockHoldings));

            CreateMap<PortfolioCreateDto, Portfolio>();

            CreateMap<PortfolioUpdateDto, Portfolio>();

            CreateMap<StockHolding, StockHoldingDto>()
                .ForMember(dest => dest.StockSymbol, opt => opt.MapFrom(src => src.Stock.Symbol));
        }
    }
}