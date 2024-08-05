using Core.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Entities.Stock
{
    public class StockHolding : EntityBase
    {
        public Guid PortfolioId { get; set; }
        public Guid StockId { get; set; }
        public int Quantity { get; set; }
        public decimal PurchasePrice { get; set; }

        [NotMapped]
        public decimal CurrentPrice { get; set; }  // Updated from external API, not stored in DB

        // Navigation properties
        public virtual Portfolio Portfolio { get; set; }
        public virtual Stock Stock { get; set; }
    }
}
