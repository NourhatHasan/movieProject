using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KinoClass.Models
{
    public class RefreshTokens
    {
        public int Id { get; set; }
        public User User { get; set; }
        public string Token { get; set; }
        public DateTime Expire { get; set; } = DateTime.UtcNow.AddDays(6);
        public bool IsExpired => DateTime.UtcNow>=Expire;
        public DateTime Revoked { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
    }
}
