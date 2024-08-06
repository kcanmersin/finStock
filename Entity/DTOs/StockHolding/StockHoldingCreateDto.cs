using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Entity.DTOs.StockHolding
{
public class StockHoldingCreateDto
{
    public int Quantity { get; set; }
    public decimal PurchasePrice { get; set; }

    public Guid PortfolioId { get; set; }
    public Guid StockId { get; set; }
}

}