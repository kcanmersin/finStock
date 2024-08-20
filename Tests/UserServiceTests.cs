using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Entity.Entities;
using Service.Authentication;
using Service.Services.Concrete;
using Entity.DTOs.Users;
using Microsoft.AspNetCore.Http;

public class UserServiceTests
{
    private readonly Mock<UserManager<AppUser>> _userManagerMock;
    private readonly Mock<RoleManager<AppRole>> _roleManagerMock;
    private readonly Mock<SignInManager<AppUser>> _signInManagerMock;
    private readonly Mock<IJwtService> _jwtServiceMock;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _userManagerMock = new Mock<UserManager<AppUser>>(
            new Mock<IUserStore<AppUser>>().Object,
            null, null, null, null, null, null, null, null);

        _roleManagerMock = new Mock<RoleManager<AppRole>>(
            new Mock<IRoleStore<AppRole>>().Object,
            null, null, null, null);

        _signInManagerMock = new Mock<SignInManager<AppUser>>(
            _userManagerMock.Object,
            new Mock<IHttpContextAccessor>().Object,
            new Mock<IUserClaimsPrincipalFactory<AppUser>>().Object,
            null, null, null, null);

        _jwtServiceMock = new Mock<IJwtService>();

        _userService = new UserService(
            _userManagerMock.Object,
            _roleManagerMock.Object,
            _signInManagerMock.Object,
            _jwtServiceMock.Object
        );
    }

    [Fact]
    public async Task RegisterUserAsync_ShouldReturnToken_WhenRegistrationSuccessful()
    {
        // Arrange
        var registrationDto = new UserRegistrationDto { Email = "suacetin@gmail.com", Password = "Tasfaest@123" };
        var user = new AppUser { UserName = registrationDto.Email, Email = registrationDto.Email };

        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<AppUser>(), registrationDto.Password))
                        .ReturnsAsync(IdentityResult.Success);

        _jwtServiceMock.Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<Guid>()))
                       .Returns("fake-jwt-token");

        // Act
        var token = await _userService.RegisterUserAsync(registrationDto);

        // Assert
        Assert.Equal("fake-jwt-token", token);
    }


    [Fact]
    public async Task LoginUserAsync_ShouldReturnToken_WhenLoginSuccessful()
    {
        // Arrange
        var loginDto = new UserLoginDto { Email = "test@example.com", Password = "Test@123" };
        var user = new AppUser { UserName = loginDto.Email, Email = loginDto.Email };

        _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
                        .ReturnsAsync(user);

        _signInManagerMock.Setup(x => x.PasswordSignInAsync(user, loginDto.Password, false, false))
                          .ReturnsAsync(SignInResult.Success);

        _jwtServiceMock.Setup(x => x.GenerateToken(It.IsAny<string>(), It.IsAny<Guid>()))
                       .Returns("fake-jwt-token");

        // Act
        var token = await _userService.LoginUserAsync(loginDto);

        // Assert
        Assert.Equal("fake-jwt-token", token);
    }

    [Fact]
    public async Task LoginUserAsync_ShouldThrowException_WhenUserNotFound()
    {
        // Arrange
        var loginDto = new UserLoginDto { Email = "test@example.com", Password = "Test@123" };

        _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
                        .ReturnsAsync((AppUser)null);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _userService.LoginUserAsync(loginDto));
    }

    [Fact]
    public async Task LoginUserAsync_ShouldThrowException_WhenLoginFails()
    {
        // Arrange
        var loginDto = new UserLoginDto { Email = "test@example.com", Password = "Test@123" };
        var user = new AppUser { UserName = loginDto.Email, Email = loginDto.Email };

        _userManagerMock.Setup(x => x.FindByEmailAsync(loginDto.Email))
                        .ReturnsAsync(user);

        _signInManagerMock.Setup(x => x.PasswordSignInAsync(user, loginDto.Password, false, false))
                          .ReturnsAsync(SignInResult.Failed);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _userService.LoginUserAsync(loginDto));
    }
}
