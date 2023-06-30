using APIkino.Repositories;
using com.sun.org.apache.xalan.@internal.xsltc.compiler.util;
using com.sun.xml.@internal.bind.v2.model.core;
using KinoClass.Models;
using Microsoft.AspNetCore.Mvc;
using Stripe;

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
        public decimal totalAmount(int userId)
        {
            return _payment.calculateTotalAmount(userId);
        }

        [HttpPost]
        public async Task<IActionResult> order(int userId)
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
        public IActionResult checkout(int userId, CheckoutRequestDto checkoutRequest)
        {
            try
            {

             
                if (checkoutRequest == null) return BadRequest("payment method is null");

                var cartItems = _payment.CartItems(userId);
                var totalAmount = _payment.calculateTotalAmount(userId);

                // Make the payment using the payment gateway
                var paymentResult = _payment.paymentProcess(checkoutRequest, totalAmount);
                

                // Handle the payment result
                if (paymentResult.Success)
                {
                   
                    _payment.UpdateOrderStatus(userId, cartItems);

                    // Clear the user's cart after successful payment
                    _payment.ClearCart(userId);

                    return Ok("Payment successful. Order placed.");
                }
                else
                {
                    string errorMessage = paymentResult.ErrorMessage;

                   
                    _logger.LogError("Payment failed: {ErrorMessage}", errorMessage);

                   
                    return BadRequest($"Payment failed: {errorMessage}. Please try again.");
                }
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "Payment processing error: {ErrorMessage}", ex.Message);
                // Handle the payment error
                return BadRequest("Payment failed. Please try again.");
            }
        }

    }
}