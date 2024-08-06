using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTOs.Transaction
{
    public class TransactionPurchaseDto
    {
        public string StockSymbol { get; set; }
        public int Quantity { get; set; }    
        public decimal Price { get; set; }     
    }

}
