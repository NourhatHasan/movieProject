using APIkino.Photo;

namespace APIkino.Interfaces
{
    public interface IPhotoAccessor
    {
        //those to methods will be working with cloudinary
        Task<uploadResult> AddPhoto(IFormFile file);
        Task<string> DeletePhoto(string publicId);
    }
}