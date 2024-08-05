using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Service.Services.Abstractions;
using Entity.DTOs.Users;

namespace  Web.Controllers.API
{
    //admin id cb94223b-ccb8-4f2f-93d7-0df96a7f065c
    //admin gmail 
    //superadmin@gmail.com
    //pass 123456
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }
        //get all user
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto registrationDto)
        {
            try
            {
                var token = await _userService.RegisterUserAsync(registrationDto);
                return Ok(new { Message = "Registration successful", Token = token });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            try
            {
                var token = await _userService.LoginUserAsync(loginDto);
                return Ok(new { Message = "Login successful", Token = token });
            }
            catch (System.UnauthorizedAccessException)
            {
                return Unauthorized(new { Message = "Invalid credentials" });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Assuming logout means to clear a cookie or a client-side stored token
            return Ok(new { Message = "Logged out successfully" });
        }
    }
}
