using Entity.DTOs.Transaction;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services.Abstractions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
   // [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }
        //    Task AddDepositAsync(TransactionDepositDto depositDto);
        //write controller for adddepositasync
        [HttpPost("deposit")]
        public async Task<ActionResult> AddDeposit([FromBody] TransactionDepositDto depositDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _transactionService.AddDepositAsync(depositDto);

            return CreatedAtAction(nameof(GetTransactionById), new { id = Guid.NewGuid() }, depositDto);
        }


    // Task AddWithdrawalAsync(TransactionWithdrawalDto withdrawalDto);
    //write controller for addwithdrawalasync
    [HttpPost("withdrawal")]
    public async Task<ActionResult> AddWithdrawal([FromBody] TransactionWithdrawalDto withdrawalDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }


        await _transactionService.AddWithdrawalAsync(withdrawalDto);

        return CreatedAtAction(nameof(GetTransactionById), new { id = Guid.NewGuid() }, withdrawalDto);
    }
    




        // GET: api/Transaction
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetAllTransactions()
        {
            var transactions = await _transactionService.GetAllTransactionsAsync();
            return Ok(transactions);
        }

        // GET: api/Transaction/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionDto>> GetTransactionById(Guid id)
        {
            var transaction = await _transactionService.GetTransactionByIdAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }
            return Ok(transaction);
        }

        // POST: api/Transaction
        [HttpPost]
        public async Task<ActionResult> AddTransaction([FromBody] TransactionCreateDto transactionCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _transactionService.AddTransactionAsync(transactionCreateDto);
            
            return CreatedAtAction(nameof(GetTransactionById), new { id = Guid.NewGuid() }, transactionCreateDto);
        }

        // PUT: api/Transaction/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody] TransactionUpdateDto transactionUpdateDto)
        {
            if (id != transactionUpdateDto.Id)
            {
                return BadRequest("Transaction ID mismatch.");
            }

            var transaction = await _transactionService.GetTransactionByIdAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            await _transactionService.UpdateTransactionAsync(transactionUpdateDto);
            return NoContent();
        }

        // DELETE: api/Transaction/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(Guid id)
        {
            var transaction = await _transactionService.GetTransactionByIdAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            await _transactionService.DeleteTransactionAsync(id);
            return NoContent();
        }
    }
}
