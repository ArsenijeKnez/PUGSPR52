
using System.Linq.Expressions;
using System.Data.Entity;
using System.Linq;
using System.Collections.Generic;
using System;

namespace Database
{
    public class UserRepository : IUserDatabaseHandler
    {
        static UserRepository()
        {
            System.Data.Entity.Database.SetInitializer<UserDbContext>(new DropCreateDatabaseAlways<UserDbContext>());
        }

        private User Read(string email, UserDbContext dbContext)
        {
            foreach (User user in dbContext.Users)
            {
                if (user.Email == email)
                {
                    return user;
                }
            }

            return null;
        }

        public User GetUserByEmailAsync(string email)
        {
            using (var _context = new UserDbContext())
            {
                User existingUser = Read(email, _context);
                return existingUser;
            }
        }

        public User GetUserByUsernameAsync(string username)
        {
            using (var _context = new UserDbContext())
            {
                return _context.Users.FirstOrDefault(u => u.Username == username);
            }
        }

        public User UpdateUserAsync(User user)
        {
            using (var _context = new UserDbContext())
            {
                _context.Entry(user).State = EntityState.Modified;
                _context.SaveChangesAsync();
                return user;
            }
        }

        public List<User> FilterUsersAsync(Expression<Func<User, bool>> filter)
        {
            using (var _context = new UserDbContext())
            {
                return  _context.Users.Where(filter).ToList();
            }
        }

        public User AddUserAsync(User user)
        {
            using (var _context = new UserDbContext())
            {
                if (user == null)
                    return new User();

                var added = _context.Users.Add(user);

                if (_context.SaveChanges() > 0)
                    return added;

                return new User();
            }
        }

        public User GetUserByIdAsync(int id)
        {
            using (var _context = new UserDbContext())
            {
                return _context.Users.FirstOrDefault(user => user.Id == id);
            }
        }
    }
}

