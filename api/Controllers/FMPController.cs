using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.Interfaces;
using api.Helpers;
using api.Dtos.Stock;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FMPController : ControllerBase
    {
        private readonly IFMPService _fmpService;

        public FMPController(IFMPService fmpService)
        {
            _fmpService = fmpService;
        }

        [HttpGet("symbol/{symbol}")]
        public async Task<IActionResult> GetStockBySymbol(string symbol)
        {
            var stock = await _fmpService.FindStockBySymbolAsync(symbol);
            if (stock != null)
                return Ok(stock);
            else
                return NotFound($"No stock found with symbol {symbol}.");
        }

        [HttpGet("search")]
        public async Task<IActionResult> GeneralSearch([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query parameter is required.");

            var results = await _fmpService.GeneralSearchAsync(query);
            if (results != null && results.Count > 0)
                return Ok(results);
            else
                return NotFound($"No results found for query: {query}.");
        }

        [HttpGet("search-by-name")]
        public async Task<IActionResult> NameSearch([FromQuery] string companyName)
        {
            if (string.IsNullOrWhiteSpace(companyName))
                return BadRequest("Company name is required.");

            var results = await _fmpService.NameSearchAsync(companyName);
            if (results != null && results.Count > 0)
                return Ok(results);
            else
                return NotFound($"No companies found with name: {companyName}.");
        }

        [HttpGet("symbol-list")]
        public async Task<IActionResult> GetSymbolList()
        {
            var symbols = await _fmpService.GetSymbolListAsync();
            if (symbols != null && symbols.Count > 0)
                return Ok(symbols);
            else
                return NotFound("No symbols available.");
        }
    }
}
