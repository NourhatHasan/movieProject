

namespace KinoClass.Models
{
    public class ChargeCreateOptions
    {
        public long Amount { get; set; } 
        public string Currency { get; set; } 
        public string Source { get; set; } 
        public string Description { get; set; }
    }
}
