﻿using KinoClass.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIkino.Repositories.Contracts
{
    public interface IRepository
    {
        Task<IEnumerable<Movies>> GetAll();
        Task<Movies> Geten(int Id);
        Task<Movies> AddMovie(Movies movie);
        Task<Movies> UpdateMovie(int Id,Movies movie);
        Task<string> Delete(int Id);
        Task<CommentDTO> CreateComment(string Body);
        Task<IEnumerable<CommentDTO>> GetAllComments(string movieId);

      

    }
}
