﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTOs.Transaction
{
    public class TransactionPurchaseDto
    {
        [DefaultValue("AAPL")]
        public string StockSymbol { get; set; }
        [DefaultValue(1)]
        public int Quantity { get; set; }    
    }

}
