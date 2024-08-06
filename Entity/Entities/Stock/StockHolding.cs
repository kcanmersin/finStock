using Core.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Entities.Stock
{
    public class StockHolding : EntityBase
    {
        public Guid UserId { get; set; }
        public int Quantity { get; set; }
        public decimal PurchasePrice { get; set; }

        [NotMapped]
        public decimal CurrentPrice { get; set; }  // Updated from external API, not stored in DB

        // Navigation property to AppUser
        public virtual AppUser User { get; set; }

        // Directly storing the stock symbol
        public string StockSymbol { get; set; }
    }
}
