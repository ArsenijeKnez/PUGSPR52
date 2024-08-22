
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Database
{
    public interface IUserDatabaseHandler
    {

        User GetUserByEmailAsync(string email);



        User GetUserByUsernameAsync(string username);



        User UpdateUserAsync(User user);


        List<User> FilterUsersAsync(Expression<Func<User, bool>> filter);

        User AddUserAsync(User user);


        User GetUserByIdAsync(int id);

    }
}
