using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Entity.DTOs.Stock
{
public class StockUpdateDto
{
    public Guid Id { get; set; }
    public string Symbol { get; set; }
    public string Name { get; set; }
}

}