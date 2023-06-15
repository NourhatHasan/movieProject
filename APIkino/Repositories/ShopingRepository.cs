using APIkino.Data;
using KinoClass.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

using System.Security.Claims;

namespace APIkino.Repositories
{
    public class ShopingRepository : IShoping
    {
        private readonly Context context;
        private readonly IHttpContextAccessor accessor;

        public ShopingRepository(Context context, IHttpContextAccessor accessor)
        {
            this.context = context;
            this.accessor = accessor;
        }
        //to avoid that an item is added more than once

        private async Task<bool> cartItemExsist(int userId, int movieId)
        {
            return await this.context.CartItem.AnyAsync(c => c.userId ==userId &&
                                                 c.MovieId == movieId); 


        }
        public async Task<KinoClass.Models.User> GetLoggedInUser()
        {
            var userIdClaim = accessor.HttpContext.User.FindFirst("UserId");
            if (userIdClaim == null)
            {
              
                throw new Exception("UserId claim is missing");
            }

            var userId = Convert.ToInt32(userIdClaim.Value);
            return await context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        }


        public async Task<CartItem> AddItem(CartItemToAddDto cartItemToAddDto)
        {
            var user =  await GetLoggedInUser();
            int userId = user.Id;
            if(await cartItemExsist(userId, cartItemToAddDto.MovieId) == true)
            {
                return null;
            }
           else
            {

                // check if the movie exists with link quary
                
                var Item = await (from movie in this.context.movies
                                  where cartItemToAddDto.MovieId == movie.Id
                                  && cartItemToAddDto.mengde< movie.mengde
                                select new CartItem
                                   {

                                      userId=userId,
                                      MovieId = movie.Id,
                                      mengde = cartItemToAddDto.mengde,
                                      price=movie.price
                                     


                                   }).SingleOrDefaultAsync();
                if(Item == null) return null;
                 else
                 {

                    var movie = await this.context.movies.FindAsync(Item.MovieId);
                    movie.mengde = movie.mengde - Item.mengde;

                    //adder to the database
                    var result = await this.context.CartItem.AddAsync(Item);
                   

                    await this.context.SaveChangesAsync();


                   
                    //here we return to the user the entity that has
                    //been added to the cartItem database 
                    return Item;
                }
               
            }
           

        }
        
        public async Task<IEnumerable<CartItem>> CartItems(int UserId)
        {
            var user = await GetLoggedInUser();
            var userId = user.Id;
            return await (from cart in this.context.Cart
                          join cartItem in this.context.CartItem
                          on userId equals cartItem.userId
                          where cart.UserId == UserId
                          select new CartItem
                          {
                              Id = cartItem.Id,
                              MovieId = cartItem.MovieId,
                              mengde = cartItem.mengde,
                             userId = userId
                          }).ToListAsync();



        }

        public decimal calculateTotalAmount(int userId)
        {
            var totalPrice =  (from cart in context.Cart
                                    join cartItem in context.CartItem
                                    on cart.UserId equals cartItem.userId
                                    where cart.UserId == userId
                                    select cartItem.mengde * cartItem.price).Sum();

            return totalPrice;

        }

        public PaymentResult paymentProcess([FromBody] KinoClass.Models.PaymentMethod method, decimal amount)
        {
            var options = new Stripe.ChargeCreateOptions

            {
                Amount = (long)(amount * 100), // Amount in cents
                Currency = "usd",
                Source = method.Token, // Payment token obtained from the client-side
                Description = "Movie purchase"
            };

            var service = new ChargeService();
            Charge charge;

            try
            {
                charge = service.Create(options);
            }
            catch (StripeException ex)
            {
                // Handle any exceptions thrown by the payment gateway
                return new PaymentResult { Success = false, ErrorMessage = ex.Message };
            }


            if (charge.Status == "succeeded")
            {
                return new PaymentResult { Success = true };
            }
            else
            {
                return new PaymentResult { Success = false, ErrorMessage = "Payment failed." };
            }
        }

        public async Task UpdateOrderStatus(int userId, Task<IEnumerable<CartItem>> cartItemsTask)
        {
            var cartItems = await cartItemsTask;

            foreach (var item in cartItems)
            {
                var order = new Order
                {
                    UserId = userId,
                    MovieId = item.MovieId,
                    Mengde = item.mengde,
                    // Set other order properties as needed
                    OrderDate = DateTime.Now
                };

                context.Order.Add(order);
            }

            context.SaveChanges();
        }


        public void ClearCart(int UserId)
        {
            var cartItems= context.CartItem.Where(x=>x.userId==UserId).ToList();
            context.CartItem.RemoveRange(cartItems);
            context.SaveChanges();
        }


        public async Task<CartItem> DeleteItem(int Id)
        {
            var item = await this.context.CartItem.FindAsync(Id);
            if (item != null)
            {
                this.context.CartItem.Remove(item);
                await this.context.SaveChangesAsync();
            }
            return item;
        }

        //getting a movie from the cart
        public async Task<CartItem> GetItem(int id)
        {
            var userId = Convert.ToInt32(accessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
           
            return await (from 
                           cartItem in this.context.CartItem
                        
                         where cartItem.Id == id
                          select new CartItem
                          {
                              Id = cartItem.Id,
                              MovieId = cartItem.MovieId,
                              mengde = cartItem.mengde,
                             userId= userId
                          }).SingleOrDefaultAsync();
        }


     


      
      

        public async Task<CartItem> UpdateItem(int Id, CartItemMengdeUpdate cartItemMengdeUpdate)
        {
            
            var item = await this.context.CartItem.FindAsync(Id);
            var gammelMengde = item.mengde;
            if (item != null)
            {
                 item.mengde = cartItemMengdeUpdate.mengde;

                var movie = await this.context.movies.FindAsync(item.MovieId);
                movie.mengde = movie.mengde+gammelMengde - item.mengde;

                await this.context.SaveChangesAsync();
                return item;
                /*
               await (from movie in this.context.movies
                                where cartItemMengdeUpdate.movieId == movie.Id
                                && cartItemMengdeUpdate.mengde < movie.mengde
                                select new CartItem
                                {


                                    MovieId = movie.Id,
                                    mengde = cartItemMengdeUpdate.mengde,

                                }).SingleOrDefaultAsync();
              await this.context.SaveChangesAsync();
              await this.context.SaveChangesAsync();
              */
            }
            return null;
        }

       

    }
   

}
