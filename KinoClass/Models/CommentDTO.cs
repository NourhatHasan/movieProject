using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KinoClass.Models
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public string Username { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
