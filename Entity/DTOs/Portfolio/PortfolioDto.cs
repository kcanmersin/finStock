using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entity.DTOs.StockHolding;

namespace Entity.DTOs.Portfolio
{
 public class PortfolioDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public List<StockHoldingDto> StockHoldings { get; set; }
        public DateTime CreatedDate { get; set; }
    }

}