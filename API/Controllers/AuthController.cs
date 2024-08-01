using Microsoft.AspNetCore.Mvc;
using  Entity.DTOs.Users;
using Microsoft.AspNetCore.Identity;
using  Entity.Entities;

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
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;

        public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(userLoginDto.Email);
            if (user != null)
            {
                var result = await _signInManager.PasswordSignInAsync(user, userLoginDto.Password, userLoginDto.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    // Consider returning a token or a success message based on your security implementation
                    return Ok("Login successful.");
                }
            }

            return Unauthorized("Invalid login attempt.");
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok("Logged out successfully.");
        }

        [HttpGet("access-denied")]
        public IActionResult AccessDenied()
        {
            return Unauthorized("Access denied. You do not have permission to access this resource.");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserAddDto userAddDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new AppUser { UserName = userAddDto.Email, Email = userAddDto.Email };
            var result = await _userManager.CreateAsync(user, userAddDto.Password);
            if (result.Succeeded)
            {
                // Optionally, sign the user in after successful registration
                await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok("User registered successfully.");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }
    }
}
