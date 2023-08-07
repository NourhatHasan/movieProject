using APIkino.Repositories.Contracts;
using APIkino.Repositories;
using Microsoft.AspNetCore.SignalR;
using APIkino.Data;

namespace APIkino.SignalR
{
    public class CommentHub : Hub
    {
        private readonly Context context;



        private readonly MoviesRepository _repository;

        public CommentHub(MoviesRepository repository)
        {
            _repository = repository;

        }


        public async Task SendComment(string body)
        {
            try
            {
                //save it to database and return a commentDTO
                var comment =await _repository.CreateComment(body).ConfigureAwait(false);


                //send the comment to everyone in the hub
                await Clients.All.SendAsync("ReceiveComment", comment);

            }
            catch (Exception ex)
            {
                // Handle exceptions and send error message to the client
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
