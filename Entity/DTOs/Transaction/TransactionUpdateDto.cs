using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entity.Entities.Stock;

namespace Entity.DTOs.Transaction
{
public class TransactionUpdateDto
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime TransactionDate { get; set; }
    public TransactionType Type { get; set; }
    public string Description { get; set; }

    public Guid UserId { get; set; }
}

}