using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entity.DTOs.Transaction;
namespace Service.Services.Abstractions
{
public interface ITransactionService
{
    Task<IEnumerable<TransactionDto>> GetAllTransactionsAsync();
    Task<TransactionDto> GetTransactionByIdAsync(Guid transactionId);


    Task AddDepositAsync(TransactionDepositDto depositDto);
    Task AddWithdrawalAsync(TransactionWithdrawalDto withdrawalDto);

 Task PurchaseStockAsync(TransactionPurchaseDto purchaseDto);
     Task SellStockAsync(TransactionSellDto sellDto);
}

}