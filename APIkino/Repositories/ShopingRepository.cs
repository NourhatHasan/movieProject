using APIkino.Data;
using KinoClass.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static com.sun.tools.@internal.xjc.reader.xmlschema.bindinfo.BIConversion;

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
