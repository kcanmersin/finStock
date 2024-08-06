using Core.Entities;
using System;

namespace Entity.Entities.Stock
{
    public class Transaction : EntityBase
    {
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }
        public TransactionType Type { get; set; }
        public string ?Description { get; set; }

        // Navigation property
        public virtual AppUser User { get; set; }
    }

    public enum TransactionType
    {
        Deposit,
        Withdrawal,
        Purchase,
        Sale
    }
}
