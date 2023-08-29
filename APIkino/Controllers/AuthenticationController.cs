using APIkino.Data;
using com.sun.xml.@internal.bind.v2.model.core;
using KinoClass.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Password = APIkino.Tools.Password;

namespace ApiSecurity.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{


   private readonly IConfiguration _conf;
    private Context _context;

    public AuthenticationController(Context context, IConfiguration conf)
    {
        _context = context;
        _conf = conf;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult> Register(UserDTO Request)
    {
        try
        {
            var dbUser = await _context.Users.Where(u => u.Username == Request.Username).FirstOrDefaultAsync();
            if (dbUser != null)
            {
                return BadRequest("username exsist already");
            }

            //hash the password
            Request.Password = Password.PasswordHashing(Request.Password);

            User user = new User
            {
                Username = Request.Username,
                Password = Request.Password,
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            var userCART = new Cart
            {
                UserId = user.Id,

                        };
           

            await _context.Cart.AddAsync(userCART);

            await _context.SaveChangesAsync();

           await logginn(Request);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest($"Failed to register {ex.Message}");
        }

    }







    //logginn 
    [HttpPost("logginn")]
    [AllowAnonymous]
    public async Task<ActionResult> logginn(UserDTO request)
    {
        try
        {
            string Innpassword = Password.PasswordHashing(request.Password);
            var dbUser = await _context.Users.Where(u => u.Username == request.Username && u.Password == Innpassword).FirstOrDefaultAsync();

            if (dbUser == null)
            {
                return BadRequest("username or password are incorect");
            }
            List<Claim> authClaim = new List<Claim>
            {
                new Claim("UserId",dbUser.Id.ToString()),
                new Claim(ClaimTypes.Name, dbUser.Username),
                new Claim("UserName", dbUser.Username)
            };


            //get our token 
            var token = this.GetToken(authClaim);

            // refresh token
            await SetRefreshTokens(dbUser);




            //return our token 
            return Ok(new
            {
                Id= dbUser.Id,
                Username = request.Username,
                Password = Innpassword,
                token = new JwtSecurityTokenHandler().WriteToken(token),
                Exception = token.ValidTo,


            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Failed to login {ex.Message}");
        }
    }

    [Authorize]
    [HttpPost("refresh")]
    public async Task<ActionResult<UserDTO>> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var principal = HttpContext.User;
        var usernameClaim = principal.Claims.FirstOrDefault(c => c.Type == "UserName");
        if (usernameClaim != null)
        {
            var username = usernameClaim.Value;
            var user = await _context.Users.Include(u => u.RefreshTokens)
                                           .FirstOrDefaultAsync(x => x.Username == username);

            if (user == null) return Unauthorized();

            var oldToken= user.RefreshTokens.SingleOrDefault(x=>x.Token==refreshToken);
            if (oldToken != null && !oldToken.IsActive)
            {
                return Unauthorized();

            }
            // Generate a new access token
            var authClaim = new List<Claim>
        {
            new Claim("UserId", user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim("UserName", user.Username)
        };

            var newAccessToken = this.GetToken(authClaim);

            // Set the new refresh token
            await SetRefreshTokens(user);

            // Return the updated access token
            return Ok(new
            {
                Id = user.Id,
                Username = user.Username,
                Token = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                Expiration = newAccessToken.ValidTo,
                RefreshToken = refreshToken
            });
        }
        return BadRequest("Unable to refresh token");
    }




    //create our token 
    private JwtSecurityToken GetToken(List<Claim>AuthClaim)
    {
        //get the signing key
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_conf["JWT:Secret"]));


        //create our tokens
        var token = new JwtSecurityToken(
            issuer: _conf["JWT:ValidIssuer"],
            audience: _conf["JWT:ValidAudience"],
            expires: DateTime.UtcNow.AddMinutes(30),
            claims: AuthClaim,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            ) ;
        return token;
        //now you can create your token in the log in
    }
    [HttpPost("GenerateRefreshToken")]
    public RefreshTokens GenerateRefreshToken()
    {
        var randomNr = new byte[32];
        using var rng= RandomNumberGenerator.Create();
        rng.GetBytes(randomNr);
        return new RefreshTokens { Token = Convert.ToBase64String(randomNr) };
    }

    private async Task SetRefreshTokens(User user)
    {
        var refreshToken= GenerateRefreshToken();
        user.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        var cookieOption = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(6)
        };
        Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOption);

    }
}
