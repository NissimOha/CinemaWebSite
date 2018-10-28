using System;
using CinemaRepository.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Data.Entity.Infrastructure;
using CinemaDb;
using CinemaRepository.IFC;

namespace CinemaRepositoryTest
{
    [TestClass]
    public class PersonRepositoryTest
    {
        [TestMethod]
        public void GetUserTypeTest()
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                var isOk1 = uOw.Persons.GetUserType("QWEASDZXC123321");
                Assert.AreEqual(isOk1, User_Type.None);

                var isOk2 = uOw.Persons.GetUserType("nissim");
                Assert.AreEqual(isOk2, User_Type.Admin);

                var isOk3 = uOw.Persons.GetUserType("aviel");
                Assert.AreEqual(isOk3, User_Type.Regular_User);
            }
        }

        [TestMethod]
        [ExpectedException(typeof(DbUpdateException))]
        public void AddTest1()
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                //passwrd length illegal
                uOw.Persons.AddUser("QWEASDZXC123321", "167", "w", "22");
                uOw.Commit();
            }
        }

        [TestMethod]
        [ExpectedException(typeof(DbUpdateException))]
        public void AddTest2()
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                //userName Alredy exsist
                uOw.Persons.AddUser("nissim", "112312367", "w", "22");
                uOw.Commit();
            }
        }

        [TestMethod]
        [ExpectedException(typeof(DbUpdateException))]
        public void AddPurchaseTest()
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                //No such a movie
                uOw.Persons.AddPurchase("nissim", 123654789, 1);
                uOw.Commit();
            }
        }

        [TestMethod]
        public void ValidateTest()
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                Assert.AreEqual(uOw.Persons.Validate("nissim", "123456"), true);
                Assert.AreEqual(uOw.Persons.Validate("nissim", "1234567"), false);
            }
        }
    }
}
