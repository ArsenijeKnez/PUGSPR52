using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Database
{
    internal class Program
    {
        static void Main(string[] args)
        {
            IUserDatabaseHandler userDatabaseHandler = new UserRepository();
            userDatabaseHandler.AddUserAsync(new User() { Username = "admin", Password = "admin" , Birthday = DateTime.Now});
            
        }
    }
}
