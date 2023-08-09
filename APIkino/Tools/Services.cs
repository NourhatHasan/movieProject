using APIkino.Repositories.Contracts;
using APIkino.Repositories;
using KinoClass.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Stripe;
using Microsoft.EntityFrameworkCore;
using APIkino.Data;
using System.Text;
using MediatR;
using APIkino.SignalR;

namespace APIkino.Tools
{
    namespace APIkino.Tools
    {
        public static class ServiceExtensions
        {
            public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
            {
                services.AddCors(options =>
                {
                    options.AddPolicy("AllowOrigin", builder =>
                    {
                        builder.WithOrigins("http://localhost:3000")
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials();
                    });
                });

                // DbContext
                services.AddDbContext<Context>(options =>
                    options.UseSqlServer(configuration.GetConnectionString("ConnectionAPIConeectionString")));

                // Register the Repository classes
                services.AddScoped<IRepository, MoviesRepository>();
                services.AddScoped<IShoping, ShopingRepository>();
            

                services.Configure<StripeSettings>(configuration.GetSection("StripeSettings"));

                // Inside the Configure method
                var stripeSettings = configuration.GetSection("StripeSettings").Get<StripeSettings>();
                StripeConfiguration.ApiKey = stripeSettings.SecretKey;

                // Authentication
                services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.SaveToken = true;
                        options.RequireHttpsMetadata = false;
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidAudience = configuration["JWT:ValidAudience"],
                            ValidIssuer = configuration["JWT:ValidIssuer"],
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
                        };

                        //authentication for the Hub
                        options.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = context =>
                            {
                                var accessToken = context.Request.Query["access_token"];
                                var path = context.HttpContext.Request.Path;
                                if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/comment")))
                                {
                                    context.Token = accessToken;
                                }
                                return Task.CompletedTask;


                            }
                        };

                    });

                // Authorization
                services.AddAuthorization(options =>
                {
                    options.AddPolicy("MustBeTheOwner", policy =>
                    {
                        policy.RequireClaim("UserName", "Solin");
                    });

                    options.FallbackPolicy = new AuthorizationPolicyBuilder()
                        .RequireAuthenticatedUser()
                        .Build();
                });


                //SignalR
                services.AddSignalR();


                //mediatR
                services.AddMediatR(typeof(ListComments.Handler));



                // Health Checks
                services.AddHealthChecks()
                    .AddSqlServer(configuration.GetConnectionString("ConnectionAPIConeectionString"));

                services.AddHttpContextAccessor();

                // Make sure to add the connection string in appsettings.json
           
            
                
            
            }
        }
    }
}