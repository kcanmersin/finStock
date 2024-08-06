using Entity.DTOs.Portfolio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services.Abstractions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]  // Optional: Requires authorization for access
    public class PortfolioController : ControllerBase
    {
        private readonly IPortfolioService _portfolioService;

        public PortfolioController(IPortfolioService portfolioService)
        {
            _portfolioService = portfolioService;
        }

        // GET: api/Portfolio
        [HttpGet]
        public async Task<ActionResult<List<PortfolioDto>>> GetAllPortfolios()
        {
            var portfolios = await _portfolioService.GetAllPortfoliosAsync();
            return Ok(portfolios);
        }

        // GET: api/Portfolio/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<PortfolioDto>> GetPortfolioByUserId(Guid userId)
        {
            var portfolio = await _portfolioService.GetPortfolioByUserIdAsync(userId);

            if (portfolio == null)
            {
                return NotFound();
            }

            return Ok(portfolio);
        }

        // GET: api/Portfolio/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PortfolioDto>> GetPortfolioById(Guid id)
        {
            var portfolio = await _portfolioService.GetPortfolioByIdAsync(id);

            if (portfolio == null)
            {
                return NotFound();
            }

            return Ok(portfolio);
        }

// POST: api/Portfolio
[HttpPost]
public async Task<IActionResult> AddPortfolio(PortfolioCreateDto portfolioCreateDto)
{
    await _portfolioService.AddPortfolioAsync(portfolioCreateDto);
    return StatusCode(201); 
}


// PUT: api/Portfolio/{id}
[HttpPut("{id}")]
public async Task<IActionResult> UpdatePortfolio(Guid id, PortfolioUpdateDto portfolioUpdateDto)
{
    if (id != portfolioUpdateDto.Id)
    {
        return BadRequest("Portfolio ID mismatch.");
    }

    var portfolioExists = await _portfolioService.PortfolioExistsAsync(id);
    if (!portfolioExists)
    {
        return NotFound();
    }

    await _portfolioService.UpdatePortfolioAsync(portfolioUpdateDto);
    return NoContent();
}


        // DELETE: api/Portfolio/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePortfolio(Guid id)
        {
            var portfolioExists = await _portfolioService.PortfolioExistsAsync(id);
            if (!portfolioExists)
            {
                return NotFound();
            }

            await _portfolioService.DeletePortfolioAsync(id);
            return NoContent();
        }
    }
}
