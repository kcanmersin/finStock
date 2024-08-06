using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Data.Repositories.Abstractions;
using Data.UnitOfWorks;
using Entity.DTOs.Transaction;
using Entity.Entities;
using Entity.Entities.Stock;
using Microsoft.AspNetCore.Http;
using Service.ExternalAPI;
using Service.Services.Abstractions;

namespace Service.Services.Concrete
{
    public class TransactionService  : ITransactionService
    {
         private readonly IRepository<Transaction> _transactionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMapper _mapper;
        private readonly IRepository<AppUser> _userRepository;
                private readonly IRepository<StockHolding> _stockHoldingRepository;
 private readonly IStockApiService _stockApiService;
    public TransactionService(
        IRepository<Transaction> transactionRepository, 
        IUnitOfWork unitOfWork, 
        IHttpContextAccessor httpContextAccessor, 
        IMapper mapper,
           IRepository<AppUser> userRepository,
                IStockApiService stockApiService,
                            IRepository<StockHolding> stockHoldingRepository
        
    )
    {
        _transactionRepository = transactionRepository;
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
        _mapper = mapper;
            _userRepository = userRepository;
                  _stockApiService = stockApiService;
                        _stockHoldingRepository = stockHoldingRepository;
    }

   private Guid GetUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : Guid.Empty;
    }

    private string GetUserEmail()
    {
        return _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Email)?.Value;
    }

        public async Task PurchaseStockAsync(TransactionPurchaseDto purchaseDto)
        {
            var currentPrice = await _stockApiService.GetStockPriceAsync(purchaseDto.StockSymbol);
            var totalCost = purchaseDto.Quantity * currentPrice;
            var userId = Guid.Parse("cb94223b-ccb8-4f2f-93d7-0df96a7f065c");
            var user = await _userRepository.GetAsync(u => u.Id == userId);

            if (user == null) throw new InvalidOperationException("User not found.");
            if (user.Balance < totalCost)
            {
                throw new InvalidOperationException("Insufficient funds to complete the purchase.");
            }

            user.Balance -= totalCost;

            var stockHolding = await _stockHoldingRepository.FirstOrDefaultAsync(sh =>
                sh.UserId == userId && sh.Stock.Symbol == purchaseDto.StockSymbol);

            if (stockHolding == null)
            {
                stockHolding = new StockHolding
                {
                    PortfolioId = user.Portfolio.Id,
                    StockId = GetStockIdBySymbol(purchaseDto.StockSymbol), // Method to fetch StockId from symbol
                    Quantity = purchaseDto.Quantity,
                    PurchasePrice = currentPrice
                };
                await _stockHoldingRepository.AddAsync(stockHolding);
            }
            else
            {
                stockHolding.Quantity += purchaseDto.Quantity;
                // Optional: Update the purchase price to new weighted average
            }

            var transaction = new Transaction
            {
                UserId = userId,
                Amount = totalCost,
                TransactionDate = DateTime.UtcNow,
                Type = TransactionType.Purchase,
                Description = $"Purchased {purchaseDto.Quantity} shares of {purchaseDto.StockSymbol} at {currentPrice} each."
            };

            await _transactionRepository.AddAsync(transaction);
            await _userRepository.UpdateAsync(user);  // Update user balance
            await _unitOfWork.SaveAsync();  // Commit all changes
        }

    public async Task AddDepositAsync(TransactionDepositDto depositDto)
    {
        //var userId = GetUserId();
            var userId = Guid.Parse("cb94223b-ccb8-4f2f-93d7-0df96a7f065c");
            var user = await _userRepository.GetAsync(u => u.Id == userId);


        if (user == null) throw new InvalidOperationException("User not found.");

        // Update user balance
        user.Balance += depositDto.Amount;

        // Create transaction record
        var transaction = new Transaction
        {
            UserId = userId,
            Amount = depositDto.Amount,
            TransactionDate = DateTime.UtcNow,
            Type = TransactionType.Deposit
        };

        await _transactionRepository.AddAsync(transaction);
        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveAsync();
    }
    

    public async Task AddWithdrawalAsync(TransactionWithdrawalDto withdrawalDto)
    {
            var userId = Guid.Parse("cb94223b-ccb8-4f2f-93d7-0df96a7f065c");
            var user = await _userRepository.GetAsync(u => u.Id == userId);

            if (user == null) throw new InvalidOperationException("User not found.");
        if (user.Balance < withdrawalDto.Amount) throw new InvalidOperationException("Insufficient funds.");

        // Update user balance
        user.Balance -= withdrawalDto.Amount;

        // Create transaction record
        var transaction = new Transaction
        {
            UserId = userId,
            Amount = -withdrawalDto.Amount, 
            TransactionDate = DateTime.UtcNow,
            Type = TransactionType.Withdrawal
        };

        await _transactionRepository.AddAsync(transaction);
        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveAsync();
    }

















    public async Task<IEnumerable<TransactionDto>> GetAllTransactionsAsync()
    {
        var transactions = await _transactionRepository.GetAllAsync(includeProperties: t => t.User);
        return _mapper.Map<IEnumerable<TransactionDto>>(transactions);
    }

    public async Task<TransactionDto> GetTransactionByIdAsync(Guid transactionId)
    {
        var transaction = await _transactionRepository.GetByGuidAsync(transactionId);
        return _mapper.Map<TransactionDto>(transaction);
    }

    public async Task AddTransactionAsync(TransactionCreateDto transactionCreateDto)
    {
        var transaction = _mapper.Map<Transaction>(transactionCreateDto);
        transaction.UserId = GetUserId();
        transaction.CreatedBy = GetUserEmail();
        transaction.CreatedDate = DateTime.UtcNow;

        await _transactionRepository.AddAsync(transaction);
        await _unitOfWork.SaveAsync();
    }

    public async Task UpdateTransactionAsync(TransactionUpdateDto transactionUpdateDto)
    {
        var transaction = await _transactionRepository.GetByGuidAsync(transactionUpdateDto.Id);
        if (transaction != null)
        {
            _mapper.Map(transactionUpdateDto, transaction);
            transaction.ModifiedBy = GetUserEmail();
            transaction.ModifiedDate = DateTime.UtcNow;

            await _transactionRepository.UpdateAsync(transaction);
            await _unitOfWork.SaveAsync();
        }
    }

    public async Task DeleteTransactionAsync(Guid transactionId)
    {
        var transaction = await _transactionRepository.GetByGuidAsync(transactionId);
        if (transaction != null)
        {
            transaction.DeletedBy = GetUserEmail();
            transaction.DeletedDate = DateTime.UtcNow;
            transaction.IsDeleted = true;

            await _transactionRepository.UpdateAsync(transaction);  // Soft delete
            await _unitOfWork.SaveAsync();
        }
    }
    }
}