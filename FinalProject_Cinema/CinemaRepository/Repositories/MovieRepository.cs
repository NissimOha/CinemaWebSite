using CinemaRepository.IFC;
using CinemaDb;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Configuration;
using System.Data.SqlClient;

namespace CinemaRepository.Repositories
{
    class MovieRepository : Repository<Movie>, IMovieRepository
    {
        #region Ctor
        public MovieRepository(CinemaDbContext context)
            : base(context)
        {
        }
        #endregion

        #region CinemaDbContext
        public CinemaDbContext CinemaDbContext
        {
            get { return Context as CinemaDbContext; }
        }
        #endregion

        #region Add
        /// <summary>
        /// Adding a new Moive by given all the parameters
        /// </summary>
        /// <param name="name"></param>
        /// <param name="movieDate"></param>
        /// <param name="numOfSeats"></param>
        /// <param name="ticketPrice"></param>
        /// <param name="pYear"></param>
        /// <param name="length"></param>
        /// <param name="posterUrl"></param>
        /// <param name="catagory"></param>
        public void Add(string name, DateTime movieDate, int numOfSeats,
            double ticketPrice, int pYear, int length, string posterUrl, int catagory)
        {
            Add(new ActiveMovies()
            {
                name = name,
                movie_date = movieDate,
                num_of_seat = numOfSeats,
                ticket_price = ticketPrice,
                p_year = pYear,
                length = length,
                poster_url = posterUrl,
                catagory_id = catagory,
            });
        }
        #endregion

        #region IsMovieExist
        /// <summary>
        /// Check whether a given momvie is exsist
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public bool IsMovieExist(int number)
        {
            return CinemaDbContext.Movie.SingleOrDefault(m => m.number == number) != null;
        }

        #endregion

        #region IsMovieExist
        /// <summary>
        /// Check whether a given momvie is exsist
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public bool IsMovieActive(int number)
        {
            return CinemaDbContext.Movie.OfType<ActiveMovies>().SingleOrDefault(m => m.number == number) != null;
        }

        #endregion

        #region GetAllMovieWithCatagory
        public IEnumerable<Movie> GetAllMovieWithCatagory()
        {
            return CinemaDbContext.Movie.OfType<ActiveMovies>().Include(c => c.Catagory);
        }
        #endregion

        #region DeleteMovie
        public void DeleteMovie(int number)
        {
            string connectionString = ConfigurationManager
                .ConnectionStrings["CinemaDbContextAdo"].ConnectionString;
            using(var con = new SqlConnection(connectionString))
            {
                using (var cmd = new SqlCommand(@"update movie set isDeleted = @isDeleted
                                                    where number = @number", con))
                {
                    cmd.Parameters.AddWithValue("@isDeleted", true);
                    cmd.Parameters.AddWithValue("@number", number);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
        #endregion

        #region UpdatePoster
        public void UpdatePoster(int number, string posterUrl)
        {
            var movie = CinemaDbContext.Movie.Single(n => n.number == number);
            movie.poster_url = posterUrl;
        }
        #endregion

        #region IsEnoughSeats
        public bool IsEnoughSeats(int number, int numOfSeats)
        {
            return CinemaDbContext.Movie.Single(m => m.number == number).num_of_seat >= numOfSeats;
        }
        #endregion

        #region UpdateSeats
        public void UpdateSeats(int number, int numOfSeats)
        {
            var movie = CinemaDbContext.Movie.Single(m => m.number == number);
            movie.num_of_seat -= numOfSeats;
        }
        #endregion
    }
}
