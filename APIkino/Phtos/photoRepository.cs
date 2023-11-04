
using APIkino.Data;
using APIkino.Interfaces;
using KinoClass.Models;

namespace APIkino.Photo
{
    public class photoRepository:Iphoto
    {
        private readonly Context _context;
        private readonly IPhotoAccessor _photoAccessor;


        public photoRepository(Context context, IPhotoAccessor photoAccessor)
        {
            _context = context;
            _photoAccessor = photoAccessor;




        }


        public async Task<photo> updatePhot(IFormFile File, string movieNeme)
        {
            var movie = await _context.Movies.FindAsync(movieNeme);
            if (movie.photo != null)
            {
                var deletePhoto = _photoAccessor.DeletePhoto(movie.photo.Id);
            }
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
            movie.photo = photo;
            _context.photos.Add(photo);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return photo;
            }
            return null;

        }
    }

   
}
