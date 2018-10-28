using CinemaRepository.IFC;
using CinemaDb;

namespace CinemaRepository.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly CinemaDbContext _context;

        public UnitOfWork(CinemaDbContext context)
        {
            _context = context;
            Persons = new PersonRepository(_context);
            Movies = new MovieRepository(_context);
        }

        public IPersonRepository Persons { get; private set; }
        public IMovieRepository Movies { get; private set; }

        public int Commit()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
