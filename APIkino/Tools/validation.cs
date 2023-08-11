
using FluentValidation;
using KinoClass.Models;

namespace APIkino.Tools
{
    public class Validation : AbstractValidator<Comments>
    {


        public Validation()
        {
            RuleFor(x => x.Body).NotEmpty();
           RuleFor(x=>x.StarRating).NotEmpty();
        }
    }



}