
using APIkino.Data;
using APIkino.Extantions;
using APIkino.Repositories;
using APIkino.Repositories.Contracts;
using com.sun.corba.se.spi.activation;
using com.sun.xml.@internal.bind.v2.model.core;
using KinoClass.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Convert = System.Convert;

namespace APIkino.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly Context context;

        //dont forget to register the repository in program.cs
        private readonly IShoping shoping;
        private readonly IRepository repository;

        public UserController(IShoping shoping,
                            IRepository repository,
                           ILogger<UserController> logger, Context context)
        {
            this.shoping = shoping;
            this.repository = repository;
            _logger = logger;
            this.context = context;
        }


        [HttpGet("CurrentUser")]
        public async Task<User> GetLoggetInUser()
        {
            //  int id = Convert.ToInt32(HttpContext.User.FindFirstValue("UserId"));
            //var user = HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            var user = await this.shoping.GetLoggedInUser();
            if (user != null)
            {
                return user;
            }
            throw new Exception("User not found.");
        }





        [HttpGet("GetItems")]
        public async Task<ActionResult<IEnumerable<CartItemDTO>>> CartItems()
        {
            try
            {

                //get the User
                var user = await context.Users.
                    FirstOrDefaultAsync(x => x.Username == HttpContext.User.FindFirst(ClaimTypes.Name).Value);

                var movies = await this.repository.GetAll();


                //if there is no movies in the sysem
                if (movies == null)
                {
                    throw new Exception("No products exist in the system");
                }


                // here we returned cartItem object
                var cartItems = await this.shoping.CartItems(user.Id);

                if (cartItems == null)
                {
                    // if ther is no items in the in the shoping cart
                    return NoContent();
                }




                //we can make convertion to get the cartItemDto (in extention)


                var UserCartItems = cartItems.ConvertToDto(movies);

                return Ok(UserCartItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "the GET call to /api/user fieled");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ex.Message);

            }


        }

        [HttpGet]
        [Route("{Id}")]
        public async Task<ActionResult<CartItemDTO>> GetItem(int Id)
        {
            try
            {


                var cartItem = await this.shoping.GetItem(Id);
                if (cartItem == null)
                {
                    return NotFound();
                }

                var movie = await this.repository.Geten(cartItem.MovieId);
                if (movie == null)
                {
                    _logger.LogError("the GET call to /api/user/{Id} fieled", Id);
                    return NotFound();


                }
                var cartItemDTO = cartItem.convertionDTO(movie);
                return Ok(cartItemDTO);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "the GET call to /api/user/{Id} fieled", Id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                     "Error getting data from the database"
                     );

            }
        }

        [HttpPost]
        public async Task<ActionResult<CartItemDTO>> AddItem([FromBody] CartItemToAddDto cartItemToAddDto)
        {
            try
            {
                var AddMovie = await this.shoping.AddItem(cartItemToAddDto);
                if (AddMovie == null)
                {
                    return BadRequest("some thing went wrong");
                }
                var movie = await this.repository.Geten(AddMovie.MovieId);
                if (movie == null)
                {
                    _logger.LogError("the Add call to /api/user fieled");
                    throw new Exception($"Something went wrong when attempting to" +
                        $" retrieve movies (movieId:({cartItemToAddDto.MovieId})");
                }
                var MovieDto = AddMovie.convertionDTO(movie);




                return CreatedAtAction(nameof(AddItem), new { id = AddMovie }, MovieDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "the GET call to /api/user fieled");
                return StatusCode(StatusCodes.Status500InternalServerError,
                     "Error getting data from the database"
                     );
            }
        }

        [HttpDelete("{Id:int}")]


        public async Task<ActionResult<CartItemDTO>> DeleteItem(int id)
        {
            try
            {
                var cartItem = await this.shoping.DeleteItem(id);
                if (cartItem == null)
                {
                    _logger.LogError("the delete call to /api/user fieled");
                    return NotFound("feil i shoping");
                }

                var movie = await this.repository.Geten(cartItem.Id);
                if (movie == null)
                {
                    _logger.LogError("the Delete call to /api/user fieled");
                    return NotFound(" feil i movie");
                }
                var cartItemDto = cartItem.convertionDTO(movie);
                return Ok(cartItemDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "the Delete call to /api/user fieled");
                return StatusCode(StatusCodes.Status500InternalServerError,
                     "Error getting data from the database"
                     );

            }
        }
        [HttpPatch("{id:int}")]
        public async Task<ActionResult<CartItemDTO>> UpdateItem(int Id, CartItemMengdeUpdate cartUpdate)
        {
            try
            {
                var Item = await this.shoping.UpdateItem(Id, cartUpdate);
                if (Item == null)
                {
                    _logger.LogError("the update call to /api/user fieled");
                    return NotFound("feil is shoping");
                }
                var movie = await this.repository.Geten(Item.MovieId);
                if (movie == null)
                {
                    _logger.LogError("the Delete call to /api/user fieled");
                    return NotFound("");
                }
                var cartItemDto = Item.convertionDTO(movie);
                return Ok(cartItemDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "the update call to /api/user fieled");
                return StatusCode(StatusCodes.Status500InternalServerError,
                     "Error getting data from the database"
                     );
            }
        }


        /*

        public async Task<IActionResult> CompletePurchase(List<int> filmIds)
        {
            // Hent den innloggede brukeren
            var user = await GetLoggetInUser();

            // Hent filmene fra databasen basert på filmIds
            var filmer = await context.movies.Where(x => filmIds.Contains(x.Id)).ToListAsync();

            // Simulér betaling via PayPal

            // Beregn den totale betalingsbeløpet basert på filmprisene
            var totalAmount = filmer.Sum(film => film.price);

            // Opprett en betalingsforespørsel til PayPal
            var paymentRequest = new PayPalPaymentRequest
            {
                Amount = totalAmount,
                // Beskrivelse kan være en kombinasjon av tittelene på filmene
                Description = string.Join(", ", filmer.Select(film => film.MovieName)),
                // Legg til annen relevant informasjon som adresser, valuta, osv.
            };

            var paypalService = new PayPalService();

            // Send betalingsforespørselen til PayPal og få en betalings-ID tilbake
            var paymentId = await paypalService.CreatePayment(paymentRequest);

            // Lagre betalingsinformasjonen i databasen eller i brukerens handlekurv

            // Fullfør betalingen i PayPal
            var paymentResult = await paypalService.ExecutePayment(paymentId);

            if (paymentResult.Success)
            {
                // Betalingen er fullført, utfør de nødvendige handlingene
                // For eksempel oppdater brukerens handlekurv, lagre kjøpshistorikk, osv.

                return RedirectToAction("PurchaseSuccess");
            }
            else
            {
                // Betalingen feilet, håndter feilen (for eksempel vis en feilmelding til brukeren)
                return RedirectToAction("PurchaseFailed");
            }
        }
    }
        */



    }
}
