using APIkino.Repositories;
using com.sun.xml.@internal.bind.v2.model.core;
using KinoClass.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIkino.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IShoping _payment;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IShoping payment, ILogger<PaymentController> logger)
        {
            _payment = payment;
            _logger = logger;
        }


        [HttpPost]
        [Route("totalAmount")]
        public  decimal totalAmount(int userId)
        {
           return _payment.calculateTotalAmount(userId);
        }

        [HttpPost]
        public async  Task<IActionResult> order(int userId)
        {
            try
            {
                var cartItems = _payment.CartItems(userId);
                await _payment.UpdateOrderStatus(userId, cartItems);

                return Ok("Order status updated successfully.");
            }
            catch (Exception ex)
            {
              
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating order status.");
            }
        }

        [HttpDelete]
        public void clear(int userId) 
        { 
            _payment.ClearCart(userId);
        }




        [HttpPost]
        [Route("checkout")]
        public IActionResult checkout(CheckoutRequestDto checkoutRequest)
        {
            try
            {
                if (checkoutRequest == null) return BadRequest("checkrequest is null");

                if (checkoutRequest.PaymentMethod == null) return BadRequest("payment method is null");

                var cartItems = _payment.CartItems(checkoutRequest.UserId);
                var totalAmount = _payment.calculateTotalAmount(checkoutRequest.UserId);

                // Make the payment using the payment gateway
                var paymentResult = _payment.paymentProcess(checkoutRequest.PaymentMethod, totalAmount);


                // Handle the payment result
                if (paymentResult.Success)
                {
                    // Perform further actions like updating the order status, generating an invoice, etc.
                    _payment.UpdateOrderStatus(checkoutRequest.UserId, cartItems);

                    // Clear the user's cart after successful payment
                    _payment.ClearCart(checkoutRequest.UserId);

                    return Ok("Payment successful. Order placed.");
                }
                else
                {
                    // Handle the failed payment scenario
                    return BadRequest("Payment failed. Please try again.");
                }
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "the checkout call failed");
                return StatusCode(StatusCodes.Status500InternalServerError,
                   "Error getting data from the database"
                   );

            }
        }

    }
}
