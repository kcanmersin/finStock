using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace Entity.DTOs.Transaction
{
public class TransactionDepositDto
{
    //default 100
    [DefaultValue(100)]
    public decimal Amount { get; set; }
}

}