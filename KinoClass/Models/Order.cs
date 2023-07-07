using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KinoClass.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public int MovieId { get; set; }
        public string MovieName { get; set; }
        public string Des { get; set; }
        public int Mengde { get; set; }
        public DateTime OrderDate {get; set;}
    }
}
