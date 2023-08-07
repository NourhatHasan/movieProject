using APIkino.Data;
using APIkino.Repositories.Contracts;
using APIkino.Tools;
using com.sun.tools.corba.se.idl;
using com.sun.xml.@internal.bind.v2.model.core;
using FluentValidation;
using java.lang;
using KinoClass.Models;
using Microsoft.EntityFrameworkCore;
using static com.sun.tools.@internal.xjc.reader.xmlschema.bindinfo.BIConversion;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Exception = System.Exception;

namespace APIkino.Repositories
{
    //husk å ha generere i program.cs
    public class MoviesRepository : IRepository
    {

        private readonly IHttpContextAccessor _accessor;
        private readonly Context _context;

        private readonly IHttpContextAccessor _contextAccessor;


        public MoviesRepository(Context context, IHttpContextAccessor httpContextAccessor, IHttpContextAccessor accessor)
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


        public async Task<IEnumerable<Movies>> GetAll()
        {


            //sjekk the logginn
            //? will chacke if it is null or not if it is not null it will get the value 


            return await (from movie in _context.movies
                          select new Movies
                          {
                              Id = movie.Id,
                              MovieName = movie.MovieName,
                              description = movie.description,
                              price = movie.price,
                              mengde = movie.mengde,

                          }).ToListAsync();

        }



        public async Task<Movies> Geten(int Id)
        {
            var movie = await _context.movies.FindAsync(Id);
            return movie;
        }

        public async Task<Movies> AddMovie(Movies mr)
        {
            var Movie = new Movies()
            {

                MovieName = mr.MovieName,
                description = mr.description,
                price = mr.price,
                mengde = mr.mengde
            };
            //takl to the database using context for store the new movie 
            await _context.movies.AddAsync(Movie);
            await _context.SaveChangesAsync();
            return Movie;
        }

        public async Task<Movies> UpdateMovie(int Id, Movies update)
        {
            var movie = await _context.movies.FindAsync(Id);


            movie.MovieName = update.MovieName;
            movie.description = update.description;
            movie.price = update.price;
            movie.mengde = update.mengde;

            await _context.SaveChangesAsync();
            return movie;
        }

        public async Task<string> Delete(int Id)
        {
            var movie = await _context.movies.FindAsync(Id);


            _context.Remove(movie);

            await _context.SaveChangesAsync();

            return "deleted";

        }
       
        public async Task<CommentDTO> CreateComment(string Body)
        {
            var comment = new Comments
            {
                Body = Body


            };
            var validator = new Validation();
            var validationResult =await validator.ValidateAsync(comment);

            if (!validationResult.IsValid)
            {
                throw new System.Exception("comment validation failed");
            }
            else
            {
                var user = await GetLoggedInUser();
                comment.Auther = user;

                var movieId = _contextAccessor.HttpContext.Request.RouteValues.FirstOrDefault(x => x.Key == "Id").Value.ToString();
                if (string.IsNullOrEmpty(movieId))
                { 
                    throw new ArgumentNullException(nameof(movieId), "MovieId is missing."); 
                }

                comment.Movie = await _context.movies.FindAsync(int.Parse(movieId)).ConfigureAwait(false);

                _context.Comments.Add(comment);
                var success = await _context.SaveChangesAsync().ConfigureAwait(false) > 0;

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

            var comments = await _context.Comments.Where(x => x.Movie.Id==movie.Id)
                .OrderBy(x=>x.CreatedAt)
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
}
