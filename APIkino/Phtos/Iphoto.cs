using KinoClass.Models;

namespace APIkino.Photo
{

    public interface Iphoto
    {
        Task<photo> updatePhot(IFormFile File, string movieNeme);

    }
}