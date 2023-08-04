using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KinoClass.Models
{
    public class Comments
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public User Auther { get; set; }
        public Movies Movie { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
