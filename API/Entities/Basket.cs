using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.FileProviders;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }//random generated

       // public List<BasketItem> Items { get; set; }= new List<BasketItem>();
        public List<BasketItem> Items { get; set; }= new();//initializing this way as well

        public void AddItem(Product product, int quantity){

            if (Items.All(item => item.ProductId != product.Id)){

               Items.Add(new BasketItem{Product=product, Quantity=quantity});//Note that we use curl braket, no constructor
            }
            
            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if(existingItem != null) existingItem.Quantity += quantity;
        }

        public void RemoveItem(int productId, int quantity){
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if(item==null) return;
            item.Quantity -=quantity;

            if(item.Quantity == 0) Items.Remove(item);


        }
    }
}