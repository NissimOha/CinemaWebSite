using System;

namespace CinemaWebApi.DTO
{
    public class MovieDto
    {
        public int number;
        public string name;
        public DateTime movieDate;
        public int numOfSeat;
        public double ticketPrice;
        public int pYear;
        public int length;
        public string posterUrl;
        public string catagory;
    }

    public enum Catagory
    {
        פעולה = 0,
        מתח,
        קומדיה,
        דרמה,
        רומנטי,
        אימה,
    }
}