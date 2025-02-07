﻿using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Collections.Generic;
using Common.Interface;
using Common.Model;
using Microsoft.EntityFrameworkCore;

namespace UserServiceStateful.UserServiceDB
{
    public class UserRepository : IUserDatabaseHandler
    {
        static UserRepository()
        {
            using (var context = new UserDbContext())
            {
                context.Database.EnsureCreated();
    
            }
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            using (var _context = new UserDbContext())
            {
                return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            }
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            using (var _context = new UserDbContext())
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                return user;
            }
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            using (var _context = new UserDbContext())
            {
                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return user;
            }
        }

        public async Task<List<User>> FilterUsersAsync(Expression<Func<User, bool>> filter)
        {
            using (var _context = new UserDbContext())
            {
                return await _context.Users.Where(filter).ToListAsync();
            }
        }

        public async Task<User> AddUserAsync(User user)
        {
            using (var _context = new UserDbContext())
            {
                if (user == null)
                    return new User();

                var added = _context.Users.Add(user);

                if (await _context.SaveChangesAsync() > 0)
                    return added.Entity;

                return new User();
            }
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            using (var _context = new UserDbContext())
            {
                return await _context.Users.FirstOrDefaultAsync(user => user.Id == id);
            }
        }
    }
}
