using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace Entity.DTOs.Transaction
{
    public class TransactionWithdrawalDto
    {
    [DefaultValue(100)]
    public decimal Amount { get; set; }
    }
}