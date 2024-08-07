using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Entity.DTOs.Transaction
{
    public class TransactionDto
    {
        
        public Guid Id { get; set; }
        public Guid PortfolioId { get; set; }
        public Guid StockId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public DateTime Date { get; set; }
    }
}