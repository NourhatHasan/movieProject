
using APIkino.Data;
using Microsoft.EntityFrameworkCore;
using APIkino.Tools.APIkino.Tools;
using APIkino.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Calling the ServiceExtensions.ConfigureServices method
builder.Services.ConfigureServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowOrigin");
//Authentication
app.UseAuthentication(); // you are the person you say you are 
app.UseAuthorization(); //access control (Rights to do something)
//Authentication




app.MapControllers();

//url to SignalR
app.MapHub<CommentHub>("/comment");

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
    logger.LogError(e, "error occurred during seeding");
}

app.Run();
