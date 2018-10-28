using CinemaDb;
using CinemaRepository.IFC;
using CinemaRepository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CinemaBL
{
    public static class CinemaService
    {
        #region ValidatePerson
        public static bool ValidatePerson(string userName, string passward)
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                if (uOw.Persons.GetUserType(userName) == User_Type.None)
                    throw (new Exception("Person does not exist"));
                return uOw.Persons.Validate(userName, passward);
            }
        }
        #endregion

        #region AddUser
        /// <summary>
        /// Add user
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="passward"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        public static void AddUser(string userName, string passward, string firstName, string lastName)
                {
                    using(var uOw = new UnitOfWork(new CinemaDbContext()))
                    {
                        if (uOw.Persons.GetUserType(userName) != User_Type.None)
                            throw (new Exception("The user_name alredy exsist"));
                        if (passward.Length < 6 || passward.Length > 12)
                            throw (new Exception("The passwarn must be 6-12 letters"));
                        uOw.Persons.AddUser(userName, passward, firstName, lastName);
                        uOw.Commit();
                    }
                }
                #endregion

        #region AddPurchase
        /// <summary>
        /// Add Purchase to an given person
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="number"></param>
        /// <param name="purchaseAmount"></param>
        public static void AddPurchase(string userName, int number, int purchaseAmount)
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                if(purchaseAmount < 1)
                    throw (new Exception("Can't by amount < 1"));
                if (!uOw.Movies.IsMovieExist(number))
                    throw (new Exception("The movie does not exist"));
                if (!uOw.Movies.IsMovieActive(number))
                    throw (new Exception("The movie does not active any more"));
                if (!uOw.Movies.IsEnoughSeats(number, purchaseAmount))
                    throw (new Exception("There is not enough free seats"));
                if(uOw.Persons.GetUserType(userName) == User_Type.None)
                    throw (new Exception("Person does not exist"));
                uOw.Persons.AddPurchase(userName, number, purchaseAmount);
                uOw.Movies.UpdateSeats(number, purchaseAmount);
                uOw.Commit();
            }
        }
        #endregion

        #region IsAdmin
        /// <summary>
        /// Check whether a given person is admin or not
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public static bool IsAdmin(string userName)
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                var type = uOw.Persons.GetUserType(userName);
                if (type == User_Type.None)
                    throw (new Exception("Person does not exsist"));
                return type == User_Type.Admin;
            }
        }
        #endregion

        #region IsUser
        /// <summary>
        /// Check whether a given person is user or not
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public static bool IsUser(string userName)
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                var type = uOw.Persons.GetUserType(userName);
                return type != User_Type.None;
            }
        }
        #endregion

        #region GetAllUserPurchases
        public static List<Purchase> GetAllUserPurchases(string userName)
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                return uOw.Persons.GetAllUserPurchases(userName).ToList();
            }
        }
        #endregion

        #region AddMovie
        public static void AddMovie(string name, DateTime movieDate, int numOfSeats,
            double ticketPrice, int pYear, int length, string posterUrl, int catagory)
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                uOw.Movies.Add(name, movieDate, numOfSeats, ticketPrice, pYear, length, posterUrl, catagory);
                uOw.Commit();
            }
        }
        #endregion

        #region DeleteMovie
        public static void DeleteMovie(int number)
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                if(!uOw.Movies.IsMovieExist(number))
                    throw (new Exception("Movie does not exsist"));

                uOw.Movies.DeleteMovie(number);
            }
        }
        #endregion

        #region GetAllMovieWithCatagory
        public static List<Movie> GetAllMovieWithCatagory()
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                return uOw.Movies.GetAllMovieWithCatagory().ToList();
            }
        }
        #endregion
    }
}
