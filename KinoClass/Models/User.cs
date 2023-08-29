using System.ComponentModel.DataAnnotations;


namespace KinoClass.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
      public string? Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public ICollection<RefreshTokens> RefreshTokens { get; set; } = new List<RefreshTokens>();

    }
}
