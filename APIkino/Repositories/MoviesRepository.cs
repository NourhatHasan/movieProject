using APIkino.Data;
using APIkino.Interfaces;
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
        private readonly IPhotoAccessor _photoAccessor;
        private readonly Context _context;

        private readonly IHttpContextAccessor _contextAccessor;


        public MoviesRepository(Context context, IHttpContextAccessor httpContextAccessor, IHttpContextAccessor accessor, IPhotoAccessor photoAccessor)
        {
            _context = context;

            _contextAccessor = httpContextAccessor;
            _accessor = accessor;
            _photoAccessor = photoAccessor;
        }



        public async Task<IEnumerable<Movies>> GetAll()
        {


            //sjekk the logginn
            //? will chacke if it is null or not if it is not null it will get the value 


            return await (from movie in _context.Movies
                          .Include(x=>x.photo)
                          select new Movies
                          {
                              Id = movie.Id,
                              MovieName = movie.MovieName,
                              description = movie.description,
                              price = movie.price,
                              mengde = movie.mengde,
                              photo=movie.photo,

                          }).ToListAsync();

        }



        public async Task<Movies> Geten(int Id)
        {
            var movie = await _context.Movies.Include(x=>x.photo).FirstOrDefaultAsync(x=>x.Id==Id);
            return movie;
        }

        public async Task<Movies> AddMovie(Movies mr, IFormFile File)
        {

            var photoUploadResult = _photoAccessor.AddPhoto(File);

            //client return photo
            var photo = new photo
            {
                Id = photoUploadResult.Result.PublicId,
                Url = photoUploadResult.Result.Url,

            };
            if (photo == null)
            {
                return null;
            }
           
            _context.photos.Add(photo);

            var Movie = new Movies()
            {

                MovieName = mr.MovieName,
                description = mr.description,
                price = mr.price,
                mengde = mr.mengde,
                photo= photo,
            };
            //takl to the database using context for store the new movie 
            await _context.Movies.AddAsync(Movie);
            await _context.SaveChangesAsync();
            return Movie;
        }

        public async Task<Movies> UpdateMovie(int Id, Movies update, IFormFile File)
        {
            var movie = await _context.Movies.FindAsync(Id);
            if (movie.photo != null)
            {
                var deletePhoto = _photoAccessor.DeletePhoto(movie.photo.Id);
            }
            if (File == null)
            {
                return null;
            }
            var photoUploadResult =await _photoAccessor.AddPhoto(File);

            if (photoUploadResult != null)
            {
                //client return photo
                var photo = new photo
                {
                    Id = photoUploadResult.PublicId,
                    Url = photoUploadResult.Url,

                };

              


                movie.MovieName = update.MovieName;
                movie.description = update.description;
                movie.price = update.price;
                movie.mengde = update.mengde;
                movie.photo = photo;




                await _context.SaveChangesAsync();
                return movie;
            }
            else
            {
                return null;
            }
        }

        public async Task<string> Delete(int Id)
        {
            var movie = await _context.Movies.FindAsync(Id);
            if (movie.photo != null)
            {
                var deletePhoto = _photoAccessor.DeletePhoto(movie.photo.Id);
            }

            _context.Remove(movie);

            await _context.SaveChangesAsync();

            return "deleted";

        }
    }
}