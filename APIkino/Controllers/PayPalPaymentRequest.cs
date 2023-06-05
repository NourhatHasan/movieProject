namespace APIkino.Controllers
{
    internal class PayPalPaymentRequest
    {
        public decimal Amount { get; set; }
        public string Description { get; set; }
    }
}