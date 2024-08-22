using Common.Dto;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interface
{
    public interface IRideServiceStateless : IService
    {
        
        Task<RideDataDto> GetRideById(int id);

        Task<float> GetDriverMetaScore(int driver_id);

        Task<RideDataDto> CreateNewRide(RideDataDto data);

        Task<RideDataDto> UpdateRide(RideDataDto data);

        Task<RideDataDto> AcceptExistingRide(int ride_id, int driver_id);

        Task<List<RideDataDto>> GetRides(int id, string role);

        Task<List<RideDataDto>> GetAvailableRides();

    }
}
