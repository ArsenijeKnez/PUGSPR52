using Common.Model;
using Microsoft.EntityFrameworkCore;

namespace EmailServiceStateless.EmailServiceDB
{
    public class EmailDbContext : DbContext
    {
        public DbSet<Email> Emails { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=C:\\Databases\\EmailDatabase.db");
        }
    }
}