using Common.Model;
using Microsoft.EntityFrameworkCore;

namespace RideServiceStateless.RideServiceDB
{
  
    public class RideDbContext : DbContext
    {
        public DbSet<Ride> Rides { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=C:\\Databases\\RideDatabase.db");
        }
    }

}
