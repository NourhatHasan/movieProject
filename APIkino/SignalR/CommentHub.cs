using APIkino.Repositories.Contracts;
using APIkino.Repositories;
using Microsoft.AspNetCore.SignalR;
using APIkino.Data;
using Microsoft.AspNetCore.Mvc;
using APIkino.Controllers;

namespace APIkino.SignalR
{
    public class CommentHub : Hub
    {

        private readonly ILogger<CommentHub> _logger;


        private readonly commentSignalR _repository;

        public CommentHub(commentSignalR repository, ILogger<CommentHub> logger)
        {
            _repository = repository;
            _logger = logger;

        }


        public async Task SendComment(string body, int movieId)
        {
            try
            {
                
                //save it to database and return a commentDTO
                var comment = await _repository.CreateComment(body, movieId);

             /*   if(comment == null) 
                {
                    _logger.LogError("the comment is null");
                }*/
                //send the comment to everyone in the hub
                await Clients.All.SendAsync("ReceiveComment", comment);

            }
            catch (ArgumentException e)
            {

              //  _logger.LogError("the comment is Arg", e.Message);
                // Handle exceptions and send error message to the client
                await Clients.Caller.SendAsync("CommentError", e.Message);

            }
            catch (Exception ex)
            {
             //   _logger.LogError("the comment is ex", ex.Message);
                await Clients.Caller.SendAsync("CommentError", "An error occurred while saving the comment.");

            }
        }


        //join every clients who connects to the Hub

        public override async Task OnConnectedAsync()
        {
            try
            {
                var httpContext= Context.GetHttpContext();
                var movieId= httpContext.Request.Query["movieId"];

                var result = await _repository.GetAllComments(movieId).ConfigureAwait(false);
                await Clients.Caller.SendAsync("LoadComments", result);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("CommentError", "An error occurred while fetching comments.");
            }
        }
    }
}
