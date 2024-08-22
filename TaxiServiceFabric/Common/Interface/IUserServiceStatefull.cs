using Common.Dto;
using Common.Model;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interface
{
    public interface IUserServiceStatefull : IService
    {
        Task<UserDto> RegisterUser(User dto);
        Task<UserDto> LoginUser(UserLoginDto dto);
        Task<UserDto> LoginGoogleUser(GoogleLoginDto dto);
        Task<UserDto> EditUser(User dto);
        Task<UserDto> GetUserByUsername(string username);
        Task<UserDto> GetUserById(int id);
        Task<IEnumerable<UserDto>> GetDrivers();
        Task<UserDto> VerifyUser(string username, bool isVerified);
        Task<UserDto> ChangePassword(string username, string oldPassword, string newPassword);
        Task<UserDto> RegisterUserGoogleAsync(User dto);

        Task<RideDataDto> GetUserRideData(int user_id);

        Task<bool> SetUserWaitOnRide(RideDataDto data);
    }

}
