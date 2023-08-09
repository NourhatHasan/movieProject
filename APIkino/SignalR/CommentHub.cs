using APIkino.Repositories.Contracts;
using APIkino.Repositories;
using Microsoft.AspNetCore.SignalR;
using APIkino.Data;
using Microsoft.AspNetCore.Mvc;
using APIkino.Controllers;
using MediatR;

namespace APIkino.SignalR
{
    public class CommentHub : Hub
    {
        private readonly IMediator _mediator;
        public CommentHub(IMediator mediator) 
        {
            _mediator = mediator;
        
        }

        public async Task SendComment(CreateComment.command comand)
        {
            var comment= await _mediator.Send(comand);

           
            //signalR to send to all clients

            await Clients.All.SendAsync("ReceiveComment", comment);
        }





        public override async Task OnConnectedAsync()
        {
            
                var httpContext = Context.GetHttpContext();
                var movieId = httpContext.Request.Query["movieId"];


            
                var result = await _mediator.Send(new ListComments.Querry { movieId= int.Parse(movieId)});

            //signalR to resceive comments after conneting the hub 
                await Clients.Caller.SendAsync("LoadComments", result);
           
        }


    }
}
