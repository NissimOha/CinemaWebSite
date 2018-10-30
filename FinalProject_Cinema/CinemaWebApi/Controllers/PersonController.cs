using CinemaBL;
using CinemaWebApi.DTO;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;

namespace CinemaWebApi.Controllers
{
    [RoutePrefix("api/person")]
    [EnableCors(origins: "http://localhost:52266", headers: "*", methods: "*")]
    public class PersonController : ApiController
    {
        #region IsAdmin
        [HttpGet]
        [Authorize]
        [Route("isAdmin/{userName}")]
        public HttpResponseMessage IsAdmin(string userName)
        {
            try
            {
                return Request.CreateResponse(HttpStatusCode.OK, CinemaService.IsAdmin(userName));
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.Forbidden, ex.Message);
            }
        }
        #endregion

        #region AddPerson
        [HttpPost]
        [Route("AddUser")]
        public HttpResponseMessage AddUser(PersonDto person)
        {
            try
            {
                CinemaService.AddUser(person.userName, person.passward,
                    person.firstName, person.lastName);
                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.Forbidden, ex.Message);
            }
        }
        #endregion

        #region GetToken
        [HttpPost]
        [Route("GetToken")]
        public HttpResponseMessage GetToken([FromBody]UserValidationDto user)
        {
            try
            {
                if (CinemaService.ValidatePerson(user.userName, user.passward))
                {
                    Claim[] claims;
                    if (CinemaService.IsAdmin(user.userName))
                    {
                        claims = new[]
                        {
                            new Claim(ClaimTypes.Name, user.userName),
                            new Claim(ClaimTypes.Role, "Admin")
                        };
                    }
                    else
                    {
                        claims = new[]
                        {
                            new Claim(ClaimTypes.Name, user.userName),
                            new Claim(ClaimTypes.Role, "RegularUser")
                        };
                    }

                    var key = new SymmetricSecurityKey(Encoding
                        .UTF8.GetBytes(ConfigurationManager.AppSettings["secretKey"]));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(
                        issuer: ConfigurationManager.AppSettings["Issuer"],
                        audience: ConfigurationManager.AppSettings["Audience"],
                        claims: claims,
                        //set the time the token is valid
                        expires: DateTime.Now.AddMinutes(15),
                        signingCredentials: creds);

                    return Request.CreateResponse(HttpStatusCode.OK, 
                        new JwtSecurityTokenHandler().WriteToken(token));
                }
                return Request.CreateResponse(HttpStatusCode.Forbidden, "Passward incorrect");
            }catch(Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.Forbidden, ex.Message);
            }
        }
        #endregion

        #region GetPurchaseHistory
        [HttpGet]
        [Authorize]
        [Route("GetPurchaseHistory/{userName}")]
        public HttpResponseMessage GetPurchaseHistory(string userName)
        {
            try
            {
                var userPurchases = CinemaService.GetAllUserPurchases(userName);
                var purchases = new List<PurchaseHistoryDto>();
                foreach(var up in userPurchases)
                {
                    purchases.Add(new PurchaseHistoryDto()
                    {
                        movieName = up.Movie.name,
                        purchaseDate = up.purchase_date,
                        purchaseAmount = up.purchase_amount,
                        ticketPrice = up.Movie.ticket_price,
                        totalPrice = up.purchase_amount * up.Movie.ticket_price,
                        posterUrl = up.Movie.poster_url
                    });
                }
                return Request.CreateResponse(HttpStatusCode.OK, purchases);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.Forbidden, ex.Message);
            }
        }
        #endregion

        #region AddPurchase
        [HttpPost]
        [Authorize]
        [Route("AddPurchase")]
        public HttpResponseMessage AddPurchase(List<PurchaseDto> purchases)
        {
            try
            {
                foreach (var p in purchases)
                {
                    CinemaService.AddPurchase(p.userName, p.number, p.numOfSeat);
                }
                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }
        #endregion
    }
}