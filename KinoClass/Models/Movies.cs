﻿
namespace KinoClass.Models
{
   public class Movies
    {
        public int Id { get; set; }
        public string? MovieName { get; set; }
        public string? description { get; set; }
        public decimal price { get; set; }
        public int mengde { get; set; }
        public photo? photo { get; set; }= new photo();
       public ICollection<Comments>? comments { get; set; }= new List<Comments>();

    }
}