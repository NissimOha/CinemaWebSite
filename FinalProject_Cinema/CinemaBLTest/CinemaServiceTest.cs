using System;
using CinemaBL;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CinemaBLTest
{
    [TestClass]
    public class CinemaServiceTest
    {
        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void ValidatePerson1()
        {
            CinemaService.ValidatePerson("QWEASDZXC123321", "123456");
        }

        [TestMethod]
        public void ValidatePerson2()
        {
            Assert.AreEqual(CinemaService.ValidatePerson("nissim", "123456"), true);
            Assert.AreEqual(CinemaService.ValidatePerson("nissim", "1234567"), false);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void AddPerson1Test()
        {
            CinemaService.AddUser("nissim", "123456", "", "");
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void AddPerson2Test()
        {
            CinemaService.AddUser("QWEASDZXC123321", "12", "", "");
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void AddPurchaseTest()
        {
            CinemaService.AddPurchase("nissim", 3, 1000);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void IsAdminTest1()
        {
            CinemaService.IsAdmin("QWEASDZXC123321");
        }

        [TestMethod]
        public void IsAdminTest2()
        {
            Assert.AreEqual(CinemaService.IsAdmin("nissim"), true);
        }

        [TestMethod]
        public void IsAdminTest3()
        {
            Assert.AreEqual(CinemaService.IsAdmin("aviel"), false);
        }
    }
}
