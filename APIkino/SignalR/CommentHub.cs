using APIkino.Repositories.Contracts;
using APIkino.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace APIkino.SignalR
{
    public class CommentHub : Hub
    {
        private readonly Context context;

       
        private readonly IShoping shoping;
        private readonly IRepository repository;

        public CommentHub()
        {
        }
    }
}
