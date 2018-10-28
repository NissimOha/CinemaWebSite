using CinemaBL;
using CinemaWebApi.DTO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace CinemaWebApi.Controllers
{
    [RoutePrefix("api/movie")]
    [EnableCors(origins: "http://localhost:52266", headers: "*", methods: "*")]
    public class MoiveController : ApiController
    {
        #region GetAllMoives
        [HttpGet]
        [Route("GetAllMoives")]
        public HttpResponseMessage GetAllMoives()
        {
            var movies = CinemaService.GetAllMovieWithCatagory();
            var movieDto = new List<MovieDto>();
            foreach (var movie in movies)
            {
                movieDto.Add(new MovieDto()
                {
                    number = movie.number,
                    name = movie.name,
                    movieDate = movie.movie_date,
                    numOfSeat = movie.num_of_seat,
                    ticketPrice = movie.ticket_price,
                    pYear = movie.p_year,
                    length = movie.length,
                    posterUrl = movie.poster_url,
                    catagory = ((Catagory)movie.catagory_id).ToString()
                });
            }
            return Request.CreateResponse(HttpStatusCode.OK, movieDto);
        }
        #endregion

        #region GetAllMoivesSecure
        [HttpGet]
        [Authorize]
        [Route("GetAllMoivesSecure")]
        public HttpResponseMessage GetAllMoivesSecure()
        {
            var userName = User.Identity.Name;
            if (!CinemaService.IsUser(userName))
                throw (new UnauthorizedAccessException("The access is only for users"));

            var movies = CinemaService.GetAllMovieWithCatagory();
            var movieDto = new List<MovieDto>();
            foreach (var movie in movies)
            {
                movieDto.Add(new MovieDto()
                {
                    number = movie.number,
                    name = movie.name,
                    movieDate = movie.movie_date,
                    numOfSeat = movie.num_of_seat,
                    ticketPrice = movie.ticket_price,
                    pYear = movie.p_year,
                    length = movie.length,
                    posterUrl = movie.poster_url,
                    catagory = ((Catagory)movie.catagory_id).ToString()
                });
            }
            return Request.CreateResponse(HttpStatusCode.OK, movieDto);
        }
        #endregion

        #region AddMovie
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Route("AddMovie")]
        public HttpResponseMessage AddMovie()
        {
            try
            {
                var userName = User.Identity.Name;
                if (!CinemaService.IsAdmin(userName))
                    throw (new UnauthorizedAccessException("The access is only for admins"));

                HttpPostedFile file = HttpContext.Current.Request.Files["img"];
                var cat = HttpContext.Current.Request.Params["catagory"].ToString();
                string ext = Path.GetExtension(file.FileName);
                var guid = Guid.NewGuid();

                int? catagory = null;
                foreach(string c in Enum.GetNames(typeof(Catagory)))
                {
                    if (c == cat)
                    {
                        catagory = (int)Enum.Parse(typeof(Catagory), c);
                        break;
                    }
                }
                if (catagory == null)
                    throw (new FormatException("There is no such catagory"));

                //Need to be changed when we have real server
                var serverPath = "D:\\FinalProject_Cinema\\CinemaClient\\poster\\";

                CinemaService.AddMovie(
                    HttpContext.Current.Request.Params["name"].ToString(),
                    Convert.ToDateTime(HttpContext.Current.Request.Params["movie_date"]),
                    Convert.ToInt32(HttpContext.Current.Request.Params["num_of_seat"]),
                    Convert.ToInt32(HttpContext.Current.Request.Params["ticket_price"]),
                    Convert.ToInt32(HttpContext.Current.Request.Params["p_year"]),
                    Convert.ToInt32(HttpContext.Current.Request.Params["length"]),
                    "../poster/" + guid + ext, 
                    catagory.Value);

                file.SaveAs(serverPath + guid + ext);
                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.Forbidden, ex.Message);
            }
        }
        #endregion

        #region DeleteMovie
        [HttpPut]
        [Authorize(Roles = "Admin")]
        [Route("DeleteMovie/{number}")]
        public HttpResponseMessage DeleteMovie(int number)
        {
            try
            {
                var userName = User.Identity.Name;
                if (!CinemaService.IsAdmin(userName))
                    throw (new UnauthorizedAccessException("The access is only for admins"));
                CinemaService.DeleteMovie(number);
                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.OK, ex.Message);
            }
        }
        #endregion
    }
}