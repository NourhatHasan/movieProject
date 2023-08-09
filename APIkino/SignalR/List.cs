
using Amazon.Runtime.Internal;
using APIkino.Data;
using KinoClass.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace APIkino.SignalR
{
    public class ListComments
    {
        public class Querry : IRequest<List<CommentDTO>>
        {
            public int movieId { get; set; }

        }
        public class Handler : IRequestHandler<Querry, List<CommentDTO>>
        {
            private readonly Context _context;

            public Handler(Context context)
            {
                _context = context;


            }

            public async Task<List<CommentDTO>> Handle(Querry request, CancellationToken cancellationToken)
            {
                var movie = await _context.movies.FindAsync(request.movieId);
                if (movie == null)
                {
                    return null;
                }

                return await _context.Comments.Where(x => x.Movie.Id == movie.Id)
                    .OrderByDescending(x => x.CreatedAt)
                      .Select(com => new CommentDTO
                      {
                          Username = com.Auther.Username,
                          CreatedAt = com.CreatedAt,
                          Body = com.Body
                      })
                    .ToListAsync();


                
            }
        }
    }
}
