





using APIkino.Data;
using APIkino.Repositories.Contracts;
using APIkino.Tools;
using KinoClass.Models;
using Microsoft.EntityFrameworkCore;

public class commentSignalR 
{

    private readonly IHttpContextAccessor _accessor;
    private readonly Context _context;

    private readonly IHttpContextAccessor _contextAccessor;


    public commentSignalR(Context context, IHttpContextAccessor httpContextAccessor, IHttpContextAccessor accessor)
    {
        _context = context;

        _contextAccessor = httpContextAccessor;
        _accessor = accessor;


    }

    public async Task<KinoClass.Models.User> GetLoggedInUser()
    {
        var userIdClaim = _accessor.HttpContext.User.FindFirst("UserId");
        if (userIdClaim == null)
        {

            throw new Exception("UserId claim is missing");
        }

        var userId = Convert.ToInt32(userIdClaim.Value);
        return await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
    }



    public async Task<CommentDTO> CreateComment(string Body, int movieId)
{

    var user = await GetLoggedInUser();


    var movie = await _context.movies.FindAsync(movieId).ConfigureAwait(false);

    var comment = new Comments
    {
        Movie = movie,
        Auther = user,
        Body = Body




    };
    var validator = new Validation();
    var validationResult = await validator.ValidateAsync(comment);

    if (!validationResult.IsValid)
    {
        throw new System.Exception("comment validation failed");
    }
    else
    {

        _context.Comments.Add(comment);

        var success = await _context.SaveChangesAsync() > 0;

        if (success)
        {
            var returnedComment = new CommentDTO
            {

                Body = comment.Body,
                Username = comment.Auther.Username,
                CreatedAt = comment.CreatedAt,
            };
            return returnedComment;
        }
        else
        {
            throw new Exception("Failed to save the comment.");
        }
    }




}


public async Task<IEnumerable<CommentDTO>> GetAllComments(string movieId)
{



    var movie = await _context.movies.FindAsync(int.Parse(movieId)).ConfigureAwait(false);
    if (movie == null)
    {
        throw new ArgumentException("Movie not found.", nameof(movieId));
    }

    var comments = await _context.Comments.Where(x => x.Movie.Id == movie.Id)
        .OrderBy(x => x.CreatedAt)
          .Select(com => new CommentDTO
          {
              Username = com.Auther.Username,
              CreatedAt = com.CreatedAt,
              Body = com.Body
          })
        .ToListAsync();



    /* var returnedComments = new List< CommentDTO>();
     comments.ForEach(com =>
     {

         var comment = new CommentDTO
         {
             Username = com.Auther.Username,
             CreatedAt = com.CreatedAt,
             Body = com.Body
         };
         returnedComments.Add(comment);
     });
    */
    return comments;

    }


 }


