using System;

namespace CinemaRepository.IFC
{
    public interface IUnitOfWork : IDisposable
    {
        IPersonRepository Persons { get; }
        IMovieRepository Movies { get; }
        int Commit();
    }
}
