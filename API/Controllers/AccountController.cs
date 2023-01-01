using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController: BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;
            
        }

        [HttpPost("login")]
        // when object is passed, its assumed that it will be provided in the bodynof HttpPost request
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if(user == null || !await _userManager.CheckPasswordAsync(user , loginDto.Password))
               return Unauthorized();

            var userBasket = await RetrieveBasket(loginDto.Username);
            var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            if (anonBasket !=null)
            {
                if(userBasket != null) _context.Baskets.Remove(userBasket);
                anonBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }
            
            return new UserDto{
                Email = user.Email,
                Token  = await _tokenService.GenerateToken(user),
                Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto() 
            };
        }

        [HttpPost("register")]

        public async Task<ActionResult>  Register(RegisterDto registerDto)
        {
            var user = new User{UserName = registerDto.Username, Email = registerDto.Email};
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);

        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>>  GetCurrentUser()
        {            
          var user = await _userManager.FindByNameAsync(User.Identity.Name); //By User object we access claims int the token
          
          var userBasket = await RetrieveBasket(User.Identity.Name);

          return new UserDto
          {
            Email = user.Email,
            Token = await _tokenService.GenerateToken(user),
            Basket =userBasket?.MapBasketToDto()
          };// is necessary to validate token in the API, in startup and add authentication services
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty("buyerId")){
                if (string.IsNullOrEmpty(buyerId)){
                    Response.Cookies.Delete("buyerId");
                    return null;
                }            
            }
            return await _context.Baskets
                        .Include(i => i.Items)  //to include related table BasketItem
                        .ThenInclude(p => p.Product) //to include table related BasketItem (Product)
//                        .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
                        .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }
            
    }
}