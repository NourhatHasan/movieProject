using KinoClass.Models;

namespace APIkino.Data
{
    public class Seed
    {
        public static async Task SeedData(Context context)
        {
            if (!context.movies.Any())
            {
               
                var movies = new List<Movies>
                {
                    new Movies
                    {
                       MovieName ="Evil Dead Rise",
                      description="A twisted tale of tow estranged sisters whose reunion is" +
                      " cut short by the rise of flesh-possessing demons",

                       price= 25,
                       mengde=10
                    
                    },
                    new Movies
                    {
                       MovieName ="scream",
                      description="Sidney has really had enough problems. Her mother was killed last year," +
                      " her father is never home and her boyfriend only wants her in bed. The small town is ravaged " +
                      "by a serial killer who is clearly inspired by various horror films. No one is safe and everyone is a suspect.",

                       price= 25,
                       mengde=10

                    }, new Movies
                    {
                       MovieName ="my fault",
                      description="Noah has to leave her town, boyfriend and friends behind and move" +
                      " into the mansion of her mother's new rich husband." +
                      " There she meets Nick, her new stepbrother. They fall madly in love in secret",

                       price= 25,
                       mengde=10

                    }, new Movies
                    {
                       MovieName ="Evil Dead Rise",
                      description="A twisted tale of tow estranged sisters whose reunion is" +
                      " cut short by the rise of flesh-possessing demons",

                       price= 25,
                       mengde=10

                    }, new Movies
                    {
                       MovieName ="Evil Dead Rise",
                      description="A twisted tale of tow estranged sisters whose reunion is" +
                      " cut short by the rise of flesh-possessing demons",

                       price= 25,
                       mengde=10

                    }, new Movies
                    {
                       MovieName ="A beautifull life",
                      description="Elliott, a young fisherman with an extraordinary voice, gets the chance of a lifetime when he is discovered " +
                      "by the successful and well-known music manager Suzanne.",

                       price= 25,
                       mengde=10

                    }, new Movies
                    {
                       MovieName ="Asterix & Obelix i dragens rike",
                      description="In the Land of the Dragon\" is a fictional adventure comedy film. In this story, " +
                      "Asterix and Obelix travel to China to help a young druid named Fu Xin rescue his village " +
                      "from the oppressive rule of a Chinese general. The Gaulish duo faces cultural clashes," +
                      " battles, and hilarious situations while using" +
                      " their strength and wit to aid the Chinese people and bring freedom to the land",

                       price= 25,
                       mengde=10

                    },

                };

                await context.movies.AddRangeAsync(movies);
                await context.SaveChangesAsync();
            }
        }
    }
}

