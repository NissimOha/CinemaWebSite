using CinemaDb;
using System.Collections.Generic;

namespace CinemaRepository.IFC
{
    public interface IPersonRepository : IRepository<Person>
    {
        bool Validate(string userName, string passward);
        User_Type GetUserType(string userName);
        void AddUser(string userName, string passward, string firstName, string lastName);
        void AddPurchase(string userName, int number, int purchaseAmount);
        IEnumerable<Purchase> GetAllUserPurchases(string userName);
    }

    public enum User_Type
    {
        Admin,
        Regular_User,
        None
    }
}
