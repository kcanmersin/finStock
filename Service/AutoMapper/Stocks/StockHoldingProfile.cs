using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Entity.DTOs.StockHolding;
using Entity.Entities.Stock;

namespace Service.AutoMapper.Stocks
{
public class StockHoldingProfile : Profile
    {
        public StockHoldingProfile()
        {
            CreateMap<StockHolding, StockHoldingDto>()
                .ForMember(dest => dest.TotalValue, opt => opt.MapFrom(src => src.Quantity * src.CurrentPrice));
        }
    }
}