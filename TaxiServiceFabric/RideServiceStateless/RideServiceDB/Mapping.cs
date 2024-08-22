using AutoMapper;
using Common.Dto;
using Common.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace RideServiceStateless.RideServiceDB
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Ride, RideDataDto>();  
            CreateMap<RideDataDto, Ride>();
        }
    }
}
