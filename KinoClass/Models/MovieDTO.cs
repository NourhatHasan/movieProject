
using System.ComponentModel.DataAnnotations;

namespace KinoClass.Models
{
    public class MovieDTO
    {
        public int Id { get; set; }

        [Required]
        public string? MovieName { get; set; }
        [Required]
        public string? description { get; set; }
        [Required]
        public decimal price { get; set; }

        [Required]
        public int mengde { get; set; }
    }
}
