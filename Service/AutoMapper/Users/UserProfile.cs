using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity.Entities;
using Entity.DTOs.Users;

namespace Service.AutoMapper.Users
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<AppUser, UserUpdateDto>().ReverseMap();
            CreateMap<AppUser, UserRegistrationDto>().ReverseMap();
            CreateMap<AppUser, UserLoginDto>().ReverseMap();


        }
    }
}
