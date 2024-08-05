using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Entity.DTOs.StockHolding;
using Entity.Entities.Stock;

namespace Service.AutoMapper.Stocks
{
 public class StockProfile : Profile
    {
        public StockProfile()
        {
            CreateMap<Stock, StockHoldingDto>()
                .ForMember(dest => dest.StockSymbol, opt => opt.MapFrom(src => src.Symbol));
        }
    }
}