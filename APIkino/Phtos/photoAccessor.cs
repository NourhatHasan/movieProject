using APIkino.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace APIkino.Photo
{
    //those two methods are dealing with cloudinary
    public class photoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;

        public photoAccessor(IOptions<CloudinarySetting> config)
        {
            //creating cloudinaryAcount to get
            //the properties from the  CloudinarySetting
            //which is the registered acount in cloudinary

            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
                );
            _cloudinary = new Cloudinary( account );
        }

        public async Task<uploadResult> AddPhoto(IFormFile File)
        {
           if(File !=null && File.Length>0 ) 
            { 
                // we open a scope with using and it automaticly close and read it 
               
                await using var stream= File.OpenReadStream();

                //creating the parametes we want to be saved in cloudinary
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(File.FileName, stream),
                    //making it to square photos
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill"),
                };

                // save in cloudinary
                var uploadResult= await _cloudinary.UploadAsync(uploadParams);

                if(uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }
                // after saving in cloudinary return the result
                return new uploadResult
                {
                    Url = uploadResult.SecureUrl.ToString(),
                    PublicId = uploadResult.PublicId,

                };
              
            }
            return null;
        }

        public async Task<string> DeletePhoto(string publicId)
        {
            var deleteParameter = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParameter);
           

            if (result.Error != null)
            {
                throw new Exception(result.Error.Message);
            }
            // after deleting from cloudinary return the result

            return result.Result;
        }
    }
}
