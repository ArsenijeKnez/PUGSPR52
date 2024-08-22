using Common;
using Common.Model;
using System.Collections.Generic;
using System.Reflection.Emit;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace UserServiceStateful.UserServiceDB
{
    public class UserDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=C:\\Databases\\UserDatabase.db");
        }
    }

}