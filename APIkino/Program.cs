using APIkino.Constants;
using APIkino.Data;
using APIkino.Repositories;
using APIkino.Repositories.Contracts;
using KinoClass.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Stripe;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});



//DbContext
// builder.Services.AddDbContext<MovieContext>(options => options.UseInMemoryDatabase("MovieDb"));
builder.Services.AddDbContextPool<Context>(options => options.
UseSqlServer(builder.Configuration.GetConnectionString("ConnectionAPIConeectionString")));


//Register the Repository class
builder.Services.AddScoped<IRepository,MoviesRepository>();
builder.Services.AddScoped<IShoping, ShopingRepository>();

builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("StripeSettings"));

// Inside the Configure method
var stripeSettings =builder.Configuration.GetSection("StripeSettings").Get<StripeSettings>();
StripeConfiguration.ApiKey = stripeSettings.SecretKey;

//Authentication


//adding the configuration and authentication and JWTBearer

ConfigurationManager conf = builder.Configuration;
builder.Services.AddAuthentication(opts =>
{
    opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(opts =>
{
    opts.SaveToken = true;
    opts.RequireHttpsMetadata = false;
    opts.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = conf["JWT:ValidAudience"],
        ValidIssuer = conf["JWT:ValidIssuer"],
        IssuerSigningKey= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(conf["JWT:Secret"]))
    };
});


//authorization


builder.Services.AddAuthorization(opts =>
{
    

    opts.AddPolicy(sjekk.MustBeTheOwner, policy =>
    {
        policy.RequireClaim("UserName", "Solin" );
        
    });

    

    opts.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});



//HealthChecks for the database also
builder.Services.AddHealthChecks().
    AddSqlServer(builder.Configuration.GetConnectionString("ConnectionAPIConeectionString"));

builder.Services.AddHttpContextAccessor();

//do not forgate to add connection string in appsetting.json


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


//Authentication
app.UseAuthentication(); // you are the person you say you are 
app.UseAuthorization(); //access controll (Rights to do something)
//Authentication

app.UseCors("AllowOrigin");


app.MapControllers();

//Healthcheck
//since we block all the pages so we need to add AllowAnonymous
app.MapHealthChecks("/health").AllowAnonymous();


//seeding the data
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    //pass the datacontext and userManager to seed method
    var context = services.GetRequiredService<Context>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);

}
catch (Exception e)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(e, "error accored during seeding");
}




app.Run();
