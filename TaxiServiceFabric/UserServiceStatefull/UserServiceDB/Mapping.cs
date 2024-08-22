using Common.Model;
using AutoMapper;
using Common.Dto;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace UserServiceStateful.UserServiceDB
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<UserRegisterDto, User>();
            CreateMap<UserLoginDto, User>();
            CreateMap<UserEditDto, User>();
            CreateMap<User, UserDto>(); 
        }
    }
}
