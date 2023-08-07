using KinoClass.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIkino.Repositories.Contracts
{
    public interface IShoping
    {

        Task<User> GetLoggedInUser();
        Task<CartItem> AddItem(CartItemToAddDto cartItemToAddDto);
        Task<CartItem> DeleteItem(int Id);
        Task<CartItem> GetItem(int id);
        Task<IEnumerable<CartItem>> CartItems(int UserId);
        Task<CartItem> UpdateItem(int Id, CartItemMengdeUpdate cartItemMengdeUpdate);

        decimal calculateTotalAmount(int UserId);
        PaymentResult paymentProcess(CheckoutRequestDto method, decimal amount);
        Task<List<Order>> UpdateOrderStatus(int userId, Task<IEnumerable<CartItem>> cartItemsTask);
        void ClearCart(int UserId);
        Task<IEnumerable<Order>> orders();
        Task<Movies> UpdateWishList(int movieId);
        Task<List<wishItems>> GetWishList();

    }
}