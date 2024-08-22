using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Common;
using Common.Dto;
using Common.Interface;
using Common.Model;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using UserServiceStateful.UserServiceDB;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace UserServiceStateful
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    internal sealed class UserServiceStatefull : StatefulService, IUserServiceStatefull
    {
        private readonly IMapper _mapper;
        private readonly IUserDatabaseHandler _repository;
        private readonly IFileStorageService _fileStorageService;

        private readonly IRideServiceStateless _ridesServices = ServiceProxy.Create<IRideServiceStateless>(new Uri("fabric:/TaxiServiceFabric/RideServiceStateless"));


        public UserServiceStatefull(StatefulServiceContext context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
            _repository = new UserRepository();
   
            //FindConfig fc = new FindConfig();
            //var configValue = fc.GetConfigSection("FileStorage");
            //if (configValue.TryGetValue("path", out string path))
            //    _fileStorageService = new FileStorageService(path);
            //else
            _fileStorageService = new FileStorageService("C:\\Databases\\ProfileImages");
        }

        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners() => this.CreateServiceRemotingReplicaListeners();

        public async Task<UserDto> RegisterUser(User user)
        {
            //var user = _mapper.Map<User>(dto);
            //if (dto.file != null)
            //{
            //    var fileUrl = await _fileStorageService.UploadFileAsync(dto.file);
            //    user.ProfilePictureUrl = fileUrl;
            //}
            if(user.UserType == "Driver")
                user.Verified = false;
            else
                user.Verified = true;
             user.RideDataID = -1;
             await _repository.AddUserAsync(user);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> LoginUser(UserLoginDto dto)
        {
            var user = await _repository.GetUserByUsernameAsync(dto.Username);
            if (user == null || user.Password != dto.Password)
                return new UserDto();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> LoginGoogleUser(GoogleLoginDto dto)
        {
            var user = await _repository.GetUserByEmailAsync(dto.Email);
            if (user == null)
                return new UserDto();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> EditUser(User user)
        {
            User old = await _repository.GetUserByEmailAsync(user.Email);
            user.Password = old.Password;
            user.Id = old.Id;
            await _repository.UpdateUserAsync(user);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> GetUserData(string username)
        {
            var user =  await _repository.GetUserByEmailAsync(username);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> GetUserById(int id)
        {
            // Da li je validan ID
            if (id <= 0)
                return new();

            try
            {
                User user =  await _repository.GetUserByIdAsync(id);

                if (user.Id != 0)
                {

                    string slika = await _fileStorageService.GetFileStringAsync(user.ProfilePictureUrl);

                    if (slika == string.Empty)
                        return new();


                    user.ProfilePictureUrl = slika;

                    return _mapper.Map<User, UserDto>(user);
                }
                else
                    return new();
            }
            catch
            {
                return new();
            }
        }

        public async Task<IEnumerable<UserDto>> GetDrivers()
        {
            var users =  await _repository.FilterUsersAsync(u => u.UserType == "Driver");
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto> VerifyUser(string username, bool isVerified)
        {
            var user =  await _repository.GetUserByUsernameAsync(username);
            user.Verified = isVerified;
             await _repository.UpdateUserAsync(user);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> ChangePassword(string username, string oldPassword, string newPassword)
        {
            var user =  await _repository.GetUserByUsernameAsync(username);
            if (user == null || user.Password != oldPassword) return new UserDto();

            user.Password = newPassword;
             await _repository.UpdateUserAsync(user);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> RegisterUserGoogleAsync(User user)
        {
            if ( await _repository.GetUserByEmailAsync(user.Email) != null) { 
                Console.Write("Email already registered");
                return new UserDto();
            }

            user.Verified = false;
             await _repository.AddUserAsync(user);
            return _mapper.Map<UserDto>(user);
        }


        public async Task<UserDto> GetUserByUsername(string username)
        {
            var user = await _repository.GetUserByUsernameAsync(username);
      

            return _mapper.Map<UserDto>(user);
        }

        public async Task<RideDataDto> GetUserRideData(int userId)
        {
            var user = await _repository.GetUserByIdAsync(userId);
            if(user == null || user.RideDataID == null)
            {
                return new RideDataDto();
            }
            var data = await _ridesServices.GetRideById(user.RideDataID.Value);
            if(data == null)
                return new RideDataDto();
            return data;
        }
        public async Task<bool> SetUserWaitOnRide(RideDataDto data)
        {
            var user = await _repository.GetUserByIdAsync(data.UserId);
            if (user != null)
            {
                user.RideDataID = data.Id;
                await _repository.UpdateUserAsync(user);
                return true;
            }
            return false;
        }
    }
}
