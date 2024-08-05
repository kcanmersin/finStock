using Entity.DTOs.Users;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Services.Abstractions
{
 public interface IUserService
    {
        //get all user
        Task<IEnumerable<AppUser>> GetAllUsersAsync();
        Task<string> RegisterUserAsync(UserRegistrationDto registrationDto);

        Task<string> LoginUserAsync(UserLoginDto loginDto);
        Task UpdateUserAsync(UserUpdateDto updateDto);
    }
}