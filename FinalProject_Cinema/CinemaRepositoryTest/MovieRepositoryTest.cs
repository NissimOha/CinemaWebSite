using System.Linq;
using CinemaDb;
using CinemaRepository.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CinemaRepositoryTest
{
    [TestClass]
    public class MovieRepositoryTest
    {
        [TestMethod]
        public void GetAllMovieWithCatagoryTest()
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                var movies = uOw.Movies.GetAllMovieWithCatagory().ToList();
                Assert.AreEqual(movies[0].Catagory.catagory_name, "קומדיה");
            }
        }

        [TestMethod]
        public void IsEnoughSeatsTest()
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                var isEnough1 = uOw.Movies.IsEnoughSeats(3, 0);
                var isEnough2 = uOw.Movies.IsEnoughSeats(3, 1000);
                Assert.AreEqual(isEnough1, true);
                Assert.AreEqual(isEnough2, false);
            }
        }

        [TestMethod]
        public void DeleteMovieTest()
        {
            using (var uOw = new UnitOfWork(new CinemaDbContext()))
            {
                uOw.Movies.DeleteMovie(3);
            }
        }
    }
}
