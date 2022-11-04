using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace API.Controllers
{
    public class ProductsController: BaseApiController
    {
        // shortcut to create constructor :"ctor"
        private readonly StoreContext context;
        public ProductsController(StoreContext context)
        {
            this.context = context;
            
        }

        [HttpGet]
        //[FromQuery] to tell from where params come from, because it is an object
        public async Task< ActionResult<List<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
             // Sort, Search, Filter - are Extensions methods
           var query = context.Products
                 .Sort(productParams.OrderBy)
                 .Search(productParams.SearchTerm)
                 .Filter(productParams.Brands,productParams.Types)
                 .AsQueryable();
          var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

          Response.AddPaginationHeader(products.MetaData); // This method comes from HttpExtension class created

           return products;
        }

        [HttpGet("{id}")] //"api/products/3"
        public async Task< ActionResult<Product> > GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id);

            if (product == null) return NotFound();

            return product;
        }
        
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters() //IActionResult only type safety is not warranted
        {
            var brands= await context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types= await context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new {brands, types}); // annonymous object

        }
    }
}