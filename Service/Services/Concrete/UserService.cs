using Entity.DTOs.Users;
using Entity.Entities;
using Microsoft.AspNetCore.Identity;
using Service.Authentication;
using Service.Services.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Services.Concrete
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IJwtService _jwtService;

        public UserService(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, SignInManager<AppUser> signInManager, IJwtService jwtService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
        }
        //get all user
        public async Task<IEnumerable<AppUser>> GetAllUsersAsync()
        {
            return _userManager.Users;
        }
        public async Task<string> RegisterUserAsync(UserRegistrationDto registrationDto)
        {
            var user = new AppUser { UserName = registrationDto.Email, Email = registrationDto.Email };
            user.PhoneNumber = "1234567890";
                user.FirstName = "John";
                user.LastName = "Doe";

            /*        public Guid RoleId { get; set; }
        public List<AppRole> Roles { get; set; }*/
             //give this properties hardcoded

            
          try
{
    var result = await _userManager.CreateAsync(user, registrationDto.Password);
    if (!result.Succeeded)
    {
        var errors = string.Join(", ", result.Errors.Select(e => e.Description));
        throw new InvalidOperationException($"Registration failed: {errors}");
    }

    // Additional code for role assignment and further processing...
}
catch (Exception ex)
{
    // Log the detailed exception message and inner exception
    Console.WriteLine($"An error occurred: {ex.Message}");
    if (ex.InnerException != null)
    {
        Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
    }
    throw;
}

            if (!string.IsNullOrEmpty(registrationDto.RoleName))
            {
                if (!await _roleManager.RoleExistsAsync(registrationDto.RoleName))
                {
                    await _roleManager.CreateAsync(new AppRole { Name = registrationDto.RoleName });
                }
                await _userManager.AddToRoleAsync(user, registrationDto.RoleName);
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            return _jwtService.GenerateToken(user.Email, user.Id);
        }

        public async Task<string> LoginUserAsync(UserLoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Login failed: User not found.");
            }

            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, lockoutOnFailure: false);
            if (!result.Succeeded)
            {
                throw new UnauthorizedAccessException("Login failed: Invalid credentials.");
            }

            return _jwtService.GenerateToken(user.Email, user.Id);
        }

        public async Task UpdateUserAsync(UserUpdateDto updateDto)
        {
            var user = await _userManager.FindByIdAsync(updateDto.UserId.ToString());
            if (user == null)
            {
                throw new ArgumentException("User not found.");
            }

            if (!string.IsNullOrEmpty(updateDto.NewEmail))
            {
                user.Email = updateDto.NewEmail;
                user.UserName = updateDto.NewEmail;
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                throw new InvalidOperationException($"Update failed: {string.Join(", ", updateResult.Errors)}");
            }

            if (!string.IsNullOrEmpty(updateDto.NewPassword))
            {
                var passwordResult = await _userManager.ChangePasswordAsync(user, user.PasswordHash, updateDto.NewPassword);
                if (!passwordResult.Succeeded)
                {
                    throw new InvalidOperationException($"Password update failed: {string.Join(", ", passwordResult.Errors)}");
                }
            }
        }
    }
}