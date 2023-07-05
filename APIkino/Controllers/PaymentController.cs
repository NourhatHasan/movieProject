
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

        
        [HttpDelete]
        public void clear(int userId)
        {
            _payment.ClearCart(userId);
        }

        [HttpPost]
        [Route("Process")]
        public IActionResult process( CheckoutRequestDto checkoutRequest, decimal totalAmount)
        {
            try
            {
                var paymentResult = _payment.paymentProcess(checkoutRequest, totalAmount);

                return Ok(paymentResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Process  error: {ErrorMessage}", ex.Message);
                
                return BadRequest("Process failed1" + ex.Message);
            }
        }

        [HttpPost]
        [Route("updateOrder/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> UpdateOrder(int userId)
        {
            try
            {
                var items = _payment.CartItems(userId);
                var order = await _payment.UpdateOrderStatus(userId, items);
                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Process error: {ErrorMessage}", ex.Message);
                return BadRequest( "updateOrder failed"+ ex.Message);
            }
        }


        [HttpPost]
        [Route("checkout/{userId}")]
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
                return BadRequest("Payment failed1"+ ex.Message);
            }
        }


        [HttpGet("GetOrders")]

        public async Task<ActionResult<IEnumerable<Order>>>Orders()
        {
            try
            {


                var Orders = await _payment.orders();


                if (Orders == null)
                {
                    throw new Exception("No Orders exist in the system");
                }


                return Ok(Orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "the GET call to Orders fieled");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ex.Message);

            }


        }

    }
}