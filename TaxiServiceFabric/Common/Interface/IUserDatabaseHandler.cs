using Common.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interface
{
    public interface IUserDatabaseHandler
    {

        Task<User> GetUserByEmailAsync(string email);

        Task<User> GetUserByUsernameAsync(string username);
        Task<User> UpdateUserAsync(User user);
        Task<List<User>> FilterUsersAsync(Expression<Func<User, bool>> filter);

        Task<User> AddUserAsync(User user);

        Task<User> GetUserByIdAsync(int id);

    }
}
