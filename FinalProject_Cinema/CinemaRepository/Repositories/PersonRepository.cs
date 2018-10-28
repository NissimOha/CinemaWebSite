using CinemaRepository.IFC;
using CinemaDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;


namespace CinemaRepository.Repositories
{
    public class PersonRepository : Repository<Person>, IPersonRepository
    {
        #region Ctor
        public PersonRepository(CinemaDbContext context)
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

        #region Validate
        public bool Validate(string userName, string passward)
        {
            return CinemaDbContext.Person.Include(ps => ps.PersonPrivateDetails)
                .Single(p => p.user_name == userName)
                .PersonPrivateDetails.passward == passward;
        }
        #endregion
        
        #region GetUserType
        public User_Type GetUserType(string userName)
        {
            if (CinemaDbContext.Person.OfType<Admin>()
                .SingleOrDefault(p => p.user_name == userName) != null)
                return User_Type.Admin;
            if (CinemaDbContext.Person.OfType<RegularUser>()
                .SingleOrDefault(p => p.user_name == userName) != null)
                return User_Type.Regular_User;
            return User_Type.None;
        }
        #endregion

        #region Add
        /// <summary>
        /// Adding a new person by given all the parameters
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="passward"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        /// <param name="isAdmin"></param>
        public void AddUser(string userName, string passward, string firstName, string lastName)
        {
            Add(new RegularUser()
            {
                first_name = firstName,
                last_name = lastName,
                user_name = userName,
                PersonPrivateDetails = new PersonPrivateDetails()
                {
                    user_name = userName,
                    passward = passward
                }
            });
        }
        #endregion

        #region addPurchase
        /// <summary>
        /// Add purchase to student
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="number"></param>
        /// <param name="numOfTickets"></param>
        /// <returns></returns>
        public void AddPurchase(string userName, int number, int purchaseAmount)
        {
            CinemaDbContext.Purchase.Add(new Purchase()
            {
                number = number,
                user_name = userName,
                purchase_amount = purchaseAmount,
                purchase_date = DateTime.Now
            });
        }
        #endregion

        #region GetAllUserPurchases
        public IEnumerable<Purchase> GetAllUserPurchases(string userName)
        {
            return CinemaDbContext.Purchase.Include(m => m.Movie)
                .Where(u => u.user_name == userName);
        }
        #endregion
    }
}
