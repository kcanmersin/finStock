using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using Data.Repositories.Abstractions;
using Entity.Entities.Stock;
using Data.UnitOfWorks;
using Service.Services.Concrete;
using Entity.Entities;
using Entity.DTOs.Transaction;
using System.Transactions;

public class TransactionServiceTests
{
    private readonly Mock<IRepository<Transaction>> _transactionRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IRepository<AppUser>> _userRepositoryMock;
    private readonly TransactionService _transactionService;
    Repository  a = new Repository();
    public TransactionServiceTests()
    {
        _transactionRepositoryMock = new Mock<IRepository<Transaction>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _userRepositoryMock = new Mock<IRepository<AppUser>>();

        _transactionService = new TransactionService(
            _transactionRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _userRepositoryMock.Object
        );
    }

    [Fact]
    public async Task AddDepositAsync_ShouldIncreaseUserBalance_WhenUserExists()
    {
        // Arrange
        var userId = Guid.NewGuid();
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
        var userId = Guid.NewGuid();
        var depositDto = new TransactionDepositDto { Amount = 50m };

        _userRepositoryMock.Setup(repo => repo.GetAsync(u => u.Id == userId))
                           .ReturnsAsync((AppUser)null); // User not found

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _transactionService.AddDepositAsync(depositDto));
    }
}
