using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KinoClass.Models
{
   public class UserDTO
    {
        //this is for registration and logging


        [Required]
        public string? Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; }=string.Empty;
       
    }
}
