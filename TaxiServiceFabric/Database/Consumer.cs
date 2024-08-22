using System;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace UserServiceStateful.UserServiceDB
{
    public class UserMessageConsumer
    {
        private readonly string _hostname = "localhost"; // Update with your RabbitMQ server hostname
        private readonly string _queueName = "userQueue";
        private readonly ConnectionFactory _factory;

        public UserMessageConsumer()
        {
            _factory = new ConnectionFactory() { HostName = _hostname };
        }

        public void Start()
        {
            using (var connection = _factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: _queueName,
                                     durable: false,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += async (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    var messageBody = Encoding.UTF8.GetString(body);
                    var message = JsonSerializer.Deserialize<UserMessage>(messageBody);

                    var response = await ProcessMessageAsync(message);

                    // Handle the response as needed
                    Console.WriteLine($"Processed message: {response}");
                };
                channel.BasicConsume(queue: _queueName,
                                     autoAck: true,
                                     consumer: consumer);

                Console.WriteLine(" Press [enter] to exit.");
                Console.ReadLine();
            }
        }

        private async Task<string> ProcessMessageAsync(UserMessage message)
        {
            switch (message.Action)
            {
                case "GetUserByEmail":
                    var userByEmail = GetUserByEmailAsync(message.Email);
                    return userByEmail != null ? $"User with email {message.Email} found." : $"User with email {message.Email} not found.";
                case "GetUserByUsername":
                    var userByUsername = GetUserByUsernameAsync(message.Username);
                    return userByUsername != null ? $"User with username {message.Username} found." : $"User with username {message.Username} not found.";
                case "UpdateUser":
                    var updatedUser = UpdateUserAsync(message.User);
                    return updatedUser != null ? $"User {message.User.Username} updated." : $"Failed to update user {message.User.Username}.";
                case "FilterUsers":
                    var filteredUsers = FilterUsersAsync(message.Filter);
                    return filteredUsers.Any() ? $"Users filtered." : $"No users found with the given filter.";
                case "AddUser":
                    var addedUser = AddUserAsync(message.User);
                    return addedUser != null ? $"User {message.User.Username} added." : $"Failed to add user {message.User.Username}.";
                case "GetUserById":
                    var userById = GetUserByIdAsync(message.UserId.Value);
                    return userById != null ? $"User with ID {message.UserId} found." : $"User with ID {message.UserId} not found.";
                default:
                    throw new ArgumentException("Unknown action: " + message.Action);
            }
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
                return _context.Users.Where(filter).ToList();
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
                    return added.Entity;

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
