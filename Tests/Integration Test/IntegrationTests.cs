using Data.Context;
using Entity.DTOs.Transaction;
using Entity.DTOs.Users;
using Entity.Entities.Stock;
using Entity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Service.Services.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

    private readonly IServiceProvider _serviceProvider;

    public IntegrationTests(WebApplicationFactory<TestStartup> factory)
    {
        _serviceProvider = factory.Services.CreateScope().ServiceProvider;
    }

    [Fact]
    public async Task UserRegistrationAndTransaction_ShouldWorkAsExpected()
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
            var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
            var transactionService = scope.ServiceProvider.GetRequiredService<ITransactionService>();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // 1. Register a new user
            var registrationDto = new UserRegistrationDto
            {
                Email = "testuser@example.com",
                Password = "Test@123",
                RoleName = "User"
            };

            var userId = await userService.RegisterUserAsync(registrationDto);
            var user = await userManager.FindByEmailAsync(registrationDto.Email);

            // Assert the user was created
            Assert.NotNull(user);
            Assert.Equal(registrationDto.Email, user.Email);

            // 2. Perform a deposit transaction for the registered user
            var depositDto = new TransactionDepositDto
            {
                Amount = 100m
            };

            await transactionService.AddDepositAsync(depositDto);

            // Assert the transaction and balance
            var transactions = await dbContext.Transactions.ToListAsync();
            var transaction = transactions.FirstOrDefault(t => t.UserId == user.Id);

            Assert.NotNull(transaction);
            Assert.Equal(100m, transaction.Amount);
            Assert.Equal(TransactionType.Deposit, transaction.Type);

            // Check user balance
            var updatedUser = await userManager.FindByIdAsync(user.Id.ToString());
            Assert.Equal(100m, updatedUser.Balance);
        }
    }
