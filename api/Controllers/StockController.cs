using api.Data;
using Microsoft.AspNetCore.Mvc;
//mapper
using api.Mappers;

namespace api.Controllers
{
    [Route("api/stock")]
    [ApiController]
    public class StockController : ControllerBase
    {

        private readonly ApplicationDBContext _context;
            public StockController(ApplicationDBContext context)
            {
                _context = context;
            }

        [HttpGet]
        public IActionResult GetAll()
        {
            // var stocks = _context.Stocks.ToList().
            // Select(s =>s.ToStockDto());
            // return Ok(stocks);
            //use mapper ToStockDto
            var stocks = _context.Stocks.ToList().Select(s => StockMappers.ToStockDto(s));
            return Ok(stocks);

        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var stock = _context.Stocks.Find(id);
            if (stock == null)
            {
                return NotFound();
            }
            return Ok(stock.StockMappers.ToStockDto());
        }
        
    }
}
