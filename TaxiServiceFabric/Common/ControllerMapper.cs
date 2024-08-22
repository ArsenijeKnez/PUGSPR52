using Common.Dto;
using Common.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public static class ControllerMapper
    {
        public static User ToUser(this UserRegisterDto dto, string profilePictureUrl)
        {
            return new User
            {
                Username = dto.Username,
                Name = dto.Name,
                Lastname = dto.Lastname,
                Password = dto.Password,
                Address = dto.Address,
                Birthday = dto.Birthday,
                UserType = dto.UserType,
                Email = dto.Email,
                ProfilePictureUrl = profilePictureUrl,
                Verified = false
            };
        }

        public static User GoogleToUser(this RegisterUserGoogleDto dto, string profilePictureUrl)
        {
            return new User
            {
                Username = dto.Username,
                Name = dto.Name,
                Lastname = dto.Lastname,
                Password = dto.Password,
                Address = dto.Address,
                Birthday = dto.Birthday,
                UserType = dto.UserType,
                Email = dto.Email,
                ProfilePictureUrl = profilePictureUrl,
                Verified = false
            };
        }

        public static User editToUser(this UserEditDto dto, string profilePictureUrl)
        {
            return new User
            {
                Username = dto.Username,
                Name = dto.Name,
                Lastname = dto.Lastname,
                Password = "",
                Address = dto.Address,
                Birthday = dto.Birthday,
                UserType = dto.UserType,
                Email = dto.Email,
                ProfilePictureUrl = profilePictureUrl,
                Verified = false
            };
        }
    }
}
