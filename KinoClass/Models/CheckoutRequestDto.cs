using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KinoClass.Models
{
    public class CheckoutRequestDto
    {
        public int UserId { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }
}
