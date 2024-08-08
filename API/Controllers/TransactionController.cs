using Entity.DTOs.Transaction;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
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

        [HttpPost("purchase")]
        public async Task<ActionResult> PurchaseStock([FromBody] TransactionPurchaseDto purchaseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _transactionService.PurchaseStockAsync(purchaseDto);

            return CreatedAtAction(nameof(GetTransactionById), new { id = Guid.NewGuid() }, purchaseDto);
        }

        [HttpPost("sell")]

        public async Task<ActionResult> SellStock([FromBody] TransactionSellDto sellDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _transactionService.SellStockAsync(sellDto);

            return CreatedAtAction(nameof(GetTransactionById), new { id = Guid.NewGuid() }, sellDto);
        }


        //    Task AddDepositAsync(TransactionDepositDto depositDto);
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

    }
}
