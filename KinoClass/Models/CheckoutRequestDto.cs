﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KinoClass.Models
{
    public class CheckoutRequestDto
    {

        public string Token { get; set; }
        public string CardholderName { get; set; } // Name on the payment card
        public string CardNumber { get; set; } // Payment card number
        public string ExpiryMonth { get; set; } // Expiry month of the card
        public string ExpiryYear { get; set; } // Expiry year of the card
        public string CVV { get; set; } // CVV or security code of the card
    }
}
