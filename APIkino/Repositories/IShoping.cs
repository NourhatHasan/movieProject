using KinoClass.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIkino.Repositories
{
    public interface IShoping
    {

        Task<KinoClass.Models.User> GetLoggedInUser();
        Task<CartItem> AddItem(CartItemToAddDto cartItemToAddDto);
        Task<CartItem> DeleteItem(int Id);
        Task<CartItem> GetItem(int id);
        Task<IEnumerable<CartItem>> CartItems(int UserId);
        Task<CartItem> UpdateItem(int Id, CartItemMengdeUpdate cartItemMengdeUpdate);

       decimal calculateTotalAmount(int UserId);
        PaymentResult paymentProcess(KinoClass.Models.PaymentMethod method, decimal amount);
       Task UpdateOrderStatus(int userId, Task<IEnumerable<CartItem>> cartItemsTask);
        void ClearCart(int UserId);

    }
}
