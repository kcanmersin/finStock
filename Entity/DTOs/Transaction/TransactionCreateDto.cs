using Entity.Entities.Stock;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Entity.DTOs.Transaction
{
public class TransactionCreateDto
{
    public decimal Amount { get; set; }
    public DateTime TransactionDate { get; set; }
    public TransactionType Type { get; set; }
    public string Description { get; set; }

    public Guid UserId { get; set; }
}

}