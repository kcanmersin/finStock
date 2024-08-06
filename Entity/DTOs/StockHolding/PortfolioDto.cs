using System;
using System.Collections.Generic;

namespace Entity.DTOs.StockHolding
{
    public class PortfolioDto
    {
        // List of stock holdings
        public List<StockHoldingDto> StockHoldings { get; set; } = new List<StockHoldingDto>();

        // Total gain/loss across all holdings
        public decimal TotalGainLoss
        {
            get
            {
                decimal gainLoss = 0;
                foreach (var holding in StockHoldings)
                {
                    gainLoss += (holding.CurrentPrice - holding.PurchasePrice) * holding.Quantity;
                }
                return gainLoss;
            }
        }

        // Total value of all stocks
        public decimal TotalValue
        {
            get
            {
                decimal totalValue = 0;
                foreach (var holding in StockHoldings)
                {
                    totalValue += holding.Quantity * holding.CurrentPrice;
                }
                return totalValue;
            }
        }
    }
}
