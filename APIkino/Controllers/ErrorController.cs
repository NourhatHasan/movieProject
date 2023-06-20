using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIkino.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ErrorController : ControllerBase
    {

        [HttpGet("NotFound")]
        public IActionResult GetNotFound()
        {
            return NotFound();
        }


        [HttpGet("BadRequest")]
        public IActionResult GetBadRequest()
        {
            return BadRequest("this is Bad Request");
        }


        [HttpGet("UnAuthorized")]
        public IActionResult GetUnAuthorized()
        {
            return Unauthorized();
        }


       
    }
}
