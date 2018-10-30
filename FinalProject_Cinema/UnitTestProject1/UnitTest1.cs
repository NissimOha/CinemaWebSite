using System;
using CinemaBL;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UnitTestProject1
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void ValidatePerson1()
        {
            CinemaService.ValidatePerson("QWEASDZXC123321", "123456");
        }
    }
}
