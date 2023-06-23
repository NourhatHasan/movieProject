
namespace KinoClass.Models
{
    //cartItem //cart
   public class CartItemDTO
    {
     
        public int userId { get; set; }
       
        public int MovieId { get; set; } //movie Id
        public string MovieName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal TotalPrice { get; set; }
        public int Mengde { get; set; }

       
    }
}

