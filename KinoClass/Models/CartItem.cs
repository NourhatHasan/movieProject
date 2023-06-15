
namespace KinoClass.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int userId { get; set; }

        public int MovieId { get; set; }
        public int mengde { get; set; }
        public decimal price { get; set; }

    }
}
