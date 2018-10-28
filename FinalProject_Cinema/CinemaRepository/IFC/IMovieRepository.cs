using CinemaDb;
using System;
using System.Collections.Generic;

namespace CinemaRepository.IFC
{
    public interface IMovieRepository : IRepository<Movie>
    {
        IEnumerable<Movie> GetAllMovieWithCatagory();
        void DeleteMovie(int number);
        void UpdatePoster(int number, string posterUrl);
        void Add(string name, DateTime movieDate, int numOfSeats, double ticketPrice,
            int pYear, int length, string posterUrl, int catagory);
        void UpdateSeats(int number, int numOfSeats);
        bool IsEnoughSeats(int number, int numOfSeats);
        bool IsMovieExist(int number);
        bool IsMovieActive(int number);
    }
}
