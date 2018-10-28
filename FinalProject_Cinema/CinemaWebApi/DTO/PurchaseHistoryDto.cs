using System;

namespace CinemaWebApi.DTO
{
    public class PurchaseHistoryDto
    {
        public string movieName;
        public DateTime purchaseDate;
        public int purchaseAmount;
        public double ticketPrice;
        public double totalPrice;
        public string posterUrl;
    }
}