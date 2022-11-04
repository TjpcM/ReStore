using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Data.Migrations;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name ="GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await RetrieveBasket();

            if (basket == null) return NotFound();

            return MapBasketToDto(basket);
        }

        
        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity )
        {
            // get the basket
            var basket = await RetrieveBasket();
            // if does not have a basket, create one
            if(basket == null) basket = CreateBasket();
            //get the product

            var product = await _context.Products.FindAsync(productId);
            if (product== null) return BadRequest(new ProblemDetails{Title ="Product not found"});

            // add item
            basket.AddItem(product, quantity);

            // save the changes
            var result = await _context.SaveChangesAsync() >0; //SaveChangesAsync() return also the number of changes 
          //CreatedAtRoute takes 2 arguments: Route  the create the Location header, and the object returned in response
            if (result)  return CreatedAtRoute("GetBasket", MapBasketToDto(basket));

            return BadRequest(new ProblemDetails{Title ="Problem saving item to basket"});
        }


        [HttpDelete]
       public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
       {
         //get the basket
          var basket = await RetrieveBasket();

          if (basket == null) return NotFound();

         //remove the item or reduce quantity
         basket.RemoveItem(productId, quantity);
         //save the change
            var result = await _context.SaveChangesAsync() > 0; //SaveChangesAsync() returns also the number of changes 
            if (result)  return Ok();

            return BadRequest(new  ProblemDetails{Title ="Problem removing item from the basket"});

       }

        private async Task<Basket> RetrieveBasket()
        {
            var basket = await _context.Baskets
                        .Include(i => i.Items)  //to include related table BasketItem
                        .ThenInclude(p => p.Product) //to include table related BasketItem (Product)
                        .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
            return basket;
        }
        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            //Note that in CookieOptions the use of curl braket
            var cookieOptions = new  CookieOptions{IsEssential=true, Expires  = DateTime.Now.AddDays(30)};
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);

            var basket = new Basket{BuyerId = buyerId}; // Note curl braket - no constructor

            _context.Baskets.Add(basket);
            return basket;
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    Type = item.Product.Type,
                    PictureUrl= item.Product.PictureUrl,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
    }
}