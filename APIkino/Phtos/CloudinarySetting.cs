namespace APIkino.Photo
{
    //to get access to the cloudinary
    //in the appsettingJson
    public class CloudinarySetting
    {
        public string CloudName { get; set; }
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
    }
}