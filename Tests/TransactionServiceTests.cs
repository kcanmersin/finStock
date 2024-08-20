using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using Data.Repositories.Abstractions;
using Data.UnitOfWorks;
using Entity.Entities.Stock;
using Entity.Entities;
using Entity.DTOs.Transaction;
using AutoMapper;
using Service.Services.Concrete;
using Microsoft.AspNetCore.Http;
using Service.ExternalAPI;

public class TransactionServiceTests
{
    private readonly Mock<IRepository<Transaction>> _transactionRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IRepository<AppUser>> _userRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
    private readonly Mock<IStockApiService> _stockApiServiceMock;
    private readonly Mock<IRepository<StockHolding>> _stockHoldingRepositoryMock;
    private readonly TransactionService _transactionService;

    public TransactionServiceTests()
    {
        _transactionRepositoryMock = new Mock<IRepository<Transaction>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _userRepositoryMock = new Mock<IRepository<AppUser>>();
        _mapperMock = new Mock<IMapper>();
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        _stockApiServiceMock = new Mock<IStockApiService>();
        _stockHoldingRepositoryMock = new Mock<IRepository<StockHolding>>();

        _transactionService = new TransactionService(
            _transactionRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _httpContextAccessorMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _stockApiServiceMock.Object,
            _stockHoldingRepositoryMock.Object
        );
    }

    [Fact]
    public async Task AddDepositAsync_ShouldIncreaseUserBalance_WhenUserExists()
    {
        // Arrange
        var userId = Guid.Parse("cb94223b-ccb8-4f2f-93d7-0df96a7f065c");
        var user = new AppUser { Id = userId, Balance = 100m };
        var depositDto = new TransactionDepositDto { Amount = 50m };

        _userRepositoryMock.Setup(repo => repo.GetAsync(u => u.Id == userId))
                           .ReturnsAsync(user);

        // Act
        await _transactionService.AddDepositAsync(depositDto);

        // Assert
        Assert.Equal(150m, user.Balance);

        _transactionRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Transaction>()), Times.Once);
        _unitOfWorkMock.Verify(uow => uow.SaveAsync(), Times.Once);
    }

    [Fact]
    public async Task AddDepositAsync_ShouldThrowInvalidOperationException_WhenUserNotFound()
    {
        // Arrange
        var depositDto = new TransactionDepositDto { Amount = 50m };

        _userRepositoryMock.Setup(repo => repo.GetAsync(u => u.Id == It.IsAny<Guid>()))
                           .ReturnsAsync((AppUser)null); // User not found

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _transactionService.AddDepositAsync(depositDto));
    }

    [Fact]
    public async Task GetTransactionByIdAsync_ShouldReturnTransaction_WhenTransactionExists()
    {
        // Arrange
        var transactionId = Guid.NewGuid();
        var transaction = new Transaction { Id = transactionId };
        var transactionDto = new TransactionDto { Id = transactionId };

        _transactionRepositoryMock.Setup(repo => repo.GetByGuidAsync(transactionId))
                                  .ReturnsAsync(transaction);
        _mapperMock.Setup(m => m.Map<TransactionDto>(transaction))
                   .Returns(transactionDto);

        // Act
        var result = await _transactionService.GetTransactionByIdAsync(transactionId);

        // Assert
        Assert.Equal(transactionId, result.Id);
    }

    [Fact]
    public async Task GetTransactionByIdAsync_ShouldReturnNull_WhenTransactionDoesNotExist()
    {
        // Arrange
        var transactionId = Guid.NewGuid();

        _transactionRepositoryMock.Setup(repo => repo.GetByGuidAsync(transactionId))
                                  .ReturnsAsync((Transaction)null);

        // Act
        var result = await _transactionService.GetTransactionByIdAsync(transactionId);

        // Assert
        Assert.Null(result);
    }
}
