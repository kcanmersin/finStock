using Core.Entities;
using System.Collections.Generic;

namespace Entity.Entities.Stock
{
    public class Stock : EntityBase
    {
        public string Symbol { get; set; }
        public string Name { get; set; }

        // Navigation property
        public virtual ICollection<StockHolding> StockHoldings { get; set; }
    }
}
