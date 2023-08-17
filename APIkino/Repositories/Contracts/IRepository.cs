using KinoClass.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIkino.Repositories.Contracts
{
    public interface IRepository
    {
        Task<IEnumerable<Movies>> GetAll();
        Task<Movies> Geten(int Id);
        Task<Movies> AddMovie(Movies movie, IFormFile File);
        Task<Movies> UpdateMovie(int Id,Movies movie);
        Task<string> Delete(int Id);
       
      

    }
}
