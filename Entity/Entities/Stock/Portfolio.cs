using Core.Entities;
using System;
using System.Collections.Generic;

namespace Entity.Entities.Stock
{
    public class Portfolio : EntityBase
    {
        public Guid UserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public virtual List<StockHolding> StockHoldings { get; set; }
    }
}
