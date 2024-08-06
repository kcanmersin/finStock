using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services.Abstractions;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   // [Authorize]
    public class StockHoldingController : ControllerBase
    {
        private readonly IStockHoldingService _stockHoldingService;

        public StockHoldingController(IStockHoldingService stockHoldingService)
        {
            _stockHoldingService = stockHoldingService;
        }

        // GET: api/StockHolding
        [HttpGet]
        public async Task<IActionResult> GetUserStockHoldings()
        {
            var stockHoldings = await _stockHoldingService.GetUserStockHoldingsAsync();
            return Ok(stockHoldings);
        }
    }
}
