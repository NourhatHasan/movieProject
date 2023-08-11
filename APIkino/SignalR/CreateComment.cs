
using APIkino.Data;
using FluentValidation;
using KinoClass.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.Formula.Functions;

namespace APIkino.SignalR
{
    public class CreateComment
    {
        public class command : IRequest<CommentDTO>
        {
            public string Body { get; set; }
            public int StarRating { get; set; }
            public int MovieId { get; set; }
        }

        public class comandvalidator: AbstractValidator<command>
        {
            public comandvalidator()
            {
                RuleFor(x => x.Body).NotEmpty()
                    .WithMessage(" body is required");
                RuleFor(x => x.StarRating).NotEmpty()
                    .WithMessage(" Star Rating is Required");
            }
        }

        public class handler : IRequestHandler<command, CommentDTO>
        {
            private readonly Context _context;
            private readonly IHttpContextAccessor _accessor;
            public handler( Context context,IHttpContextAccessor accessor )
            {    _context = context;
                _accessor = accessor;
               
            }

            public async Task<CommentDTO> Handle(command request, CancellationToken cancellationToken)
            {
                var movie = await _context.movies.FindAsync(request.MovieId);
                if (movie == null) { return null; }

                var userIdClaim = _accessor.HttpContext.User.FindFirst("UserId");
                if (userIdClaim == null)
                {

                    throw new Exception("UserId claim is missing");
                }

                var userId = Convert.ToInt32(userIdClaim.Value);
                var user= await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);

                var comment = new Comments
                {
                    Auther = user,
                    Movie = movie,
                    StarRating=request.StarRating,
                    Body = request.Body,
                    CreatedAt = DateTime.UtcNow
                };
                movie.comments.Add(comment);
                _context.Comments.Add(comment);

              var success=  await _context.SaveChangesAsync();
                if (success > 0)
                {
                    var commentToReturn = new CommentDTO
                    {
                        Id=comment.Id,
                        Username = user.Username,
                        StarRating = request.StarRating,
                        Body = request.Body,
                        CreatedAt = DateTime.UtcNow


                    };

                    return commentToReturn;
                }
                return null;

            }

                
        }
    }
}
