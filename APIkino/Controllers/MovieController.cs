﻿using APIkino.Constants;
using APIkino.Data;
using APIkino.Photo;
using APIkino.Repositories.Contracts;
using com.sun.corba.se.spi.activation;
using com.sun.xml.@internal.bind.v2.model.core;
using KinoClass.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace APIkino.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
  
    public class MovieController : ControllerBase
    {
        private readonly ILogger<MovieController> _logger;

        private readonly IRepository _repository;
        private readonly Iphoto _photo;
        public MovieController(IRepository repository, ILogger<MovieController> logger, Iphoto photo)
        {
           _repository= repository;
            _logger = logger;
            _photo = photo;

        }




        [HttpGet]
        [AllowAnonymous]

        //the banefet of returning ActionResult is that
        //as well as returning the requested data to the client,
        //it returns also a responce for example Http200 or 404
        public async Task<ActionResult<IEnumerable<Movies>>> GetAll()
        {
            try
            {


                //sjekk the logginn
                //? will chacke if it is null or not if it is not null it will get the value 


               var result= await _repository.GetAll();


                // here it will response with 404
                if(result== null)
                {
                    _logger.LogError("the GET call to /api/movies fieled");
                    return NotFound();

                }

                _logger.LogInformation("Get: api/movie");
                return Ok(result);


            }
            catch (Exception ex)
            {
                
                _logger.LogError(ex, "the GET call to /api/movies fieled");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error getting data from the database"
                    );
            }


        }
        

        [HttpGet]
        [Route("{Id}")]
        [Authorize(Policy = sjekk.MustBeTheOwner)]
        [AllowAnonymous]
        public async Task<ActionResult<Movies>> Geten([FromRoute] int Id)
        {
            
            try
            {
                var movie = await _repository.Geten(Id);
                if (movie != null)
                {
                    _logger.LogInformation("Get: api/movie/{Id}", Id);
                    return Ok(movie);

                }
                return BadRequest();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "the GET call to /api/movies/{Id} fieled", Id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                     "Error getting data from the database"
                     );
            }



           
        }


        [HttpPost]
       [Authorize(Policy = sjekk.MustBeTheOwner)]
        public async Task<Movies> AddMovie([FromForm] MovieDTO mr, IFormFile File)
        {
            try
            {
                //add the new movie
                var movie = new Movies
                {
                    MovieName = mr.MovieName,
                    price = mr.price,
                    description = mr.description,
                    mengde = mr.mengde,
                };
                  var adding=  await _repository.AddMovie(movie,File);
                
                if ( movie!= null)
                {
                   // var photo = await _photo.updatePhot(photoFile, movie.MovieName);
                    _logger.LogInformation("Post: api/movie ");
                    return adding;
                }
                _logger.LogError("the POST call to /api/movies fieled. Task value was {mr}", mr);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "the POST call to /api/movies fieled. Task value was {mr}", mr);

                return null;
            }


        }

        

      


        

        [HttpPut]
        [Route("{Id}")]
        [Authorize(Policy = sjekk.MustBeTheOwner)]
        public async Task<ActionResult> Update([FromRoute] int Id, [FromForm] MovieDTO update, IFormFile File)
        {
            
            try
            {
                var newmovie = new Movies
                {
                    MovieName = update.MovieName,
                    price = update.price,
                    description = update.description,
                    mengde = update.mengde,


                };
                var movie = await _repository.UpdateMovie(Id, newmovie, File);

                if (movie != null)
                {
                    _logger.LogInformation( "Put: api/movie/{Id} (update: {update})", Id, update);
                    return Ok(movie);

                }
                _logger.LogError("the Put call to api/movies/{Id} feiled  update value was {update}", Id, update);
                return BadRequest("did not find the movie");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "the Put call to api/movies/{Id} feiled  update value was {update}", Id, update);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error getting data from the database"
                    );
            }

           

        }




        [HttpDelete]
        [Route("{Id}")]
       [Authorize(Policy = sjekk.MustBeTheOwner)]
        public async Task<ActionResult> Delete([FromRoute] int Id)
        {

            try
            {
                var movie = await _repository.Delete(Id);

                if (movie != null)
                {
                    _logger.LogInformation("Delete: api/movies/{Id}", Id);
                    return Ok();


                }
                _logger.LogError("the Delete call to api/movie/{Id} failed", Id);

                return BadRequest("did not find the movie");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "the Delete call to api/movie/{Id} f", Id);
                return StatusCode(StatusCodes.Status500InternalServerError,
                   "Error getting data from the database"
                   );

            }
        }


   

    }
}

