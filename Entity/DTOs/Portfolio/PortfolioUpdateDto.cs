using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entity.DTOs.StockHolding;

namespace Entity.DTOs.Portfolio
{
 public class PortfolioUpdateDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        //public Guid UserId { get; set; }
        public List<StockHoldingDto> StockHoldings { get; set; }
    }
}