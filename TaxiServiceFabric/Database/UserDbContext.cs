using System.Data.Entity;
using System.Collections.Generic;
using System.Reflection.Emit;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Database
{
    public class UserDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

    }

}