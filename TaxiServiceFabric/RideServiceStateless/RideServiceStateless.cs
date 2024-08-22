using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Common.Dto;
using Common.Interface;
using Common.Model;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using RideServiceStateless.RideServiceDB;

namespace RideServiceStateless
{
    /// <summary>
    /// An instance of this class is created for each service instance by the Service Fabric runtime.
    /// </summary>
    internal sealed class RideServiceStateless : StatelessService, IRideServiceStateless
    {
        private readonly IMapper _mapper;
        private readonly IUserServiceStatefull _usersServices = ServiceProxy.Create<IUserServiceStatefull>(new Uri("fabric:/TaxiServiceFabric/UserServiceStatefull"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);

        public RideServiceStateless(StatelessServiceContext context, IMapper mapper)
            : base(context)
        { _mapper = mapper; }

        public async Task<RideDataDto> GetRideById(int id)
        {
            if (id <= 0) return new RideDataDto { Id = 0 };

            try
            {
                var ride = await new RidesRepository().GetRideByIdAsync(id);
                return _mapper.Map<RideDataDto>(ride);
            }
            catch
            {
                return new RideDataDto { Id = 0 };
            }
        }

        public async Task<float> GetDriverMetaScore(int driverId)
        {
            if (driverId <= 0) return 0.0f;

            try
            {
                var rides = await new RidesRepository().FilterRidesAsync(r => r.DriverId == driverId && r.RideStatus == StatusOfRide.Done && r.ReviewScore > 0);
                if (rides.Count == 0) return 0.0f;

                var averageScore = rides.Average(r => r.ReviewScore);
                return (float)Math.Round(averageScore, 2);
            }
            catch
            {
                return 0.0f;
            }
        }


        public async Task<RideDataDto> CreateNewRide(RideDataDto data)
        {
            try
            {
                var ride = _mapper.Map<Ride>(data);
                ride.RideStatus = StatusOfRide.Created;

                var createdRide = await new RidesRepository().AddRideAsync(ride);
                return createdRide.Id != 0 ? _mapper.Map<RideDataDto>(createdRide) : new RideDataDto { Id = 0 };
            }
            catch
            {
                return new RideDataDto { Id = 0 };
            }
        }

        public async Task<RideDataDto> UpdateRide(RideDataDto data)
        {
            try
            {
                if (data.Id == 0) return new RideDataDto { Id = 0 };

                var ridesRepository = new RidesRepository();
                var existingRide = await ridesRepository.GetRideByIdAsync(data.Id);
                if (existingRide.Id == 0) return new RideDataDto { Id = 0 };

                if (data.DriverId == data.UserId)
                {
                    data.DriverId = existingRide.DriverId;
                    data.UserId = existingRide.UserId;
                }

                if (data.WaitingTime == 0) data.WaitingTime = existingRide.WaitingTime;
                if (data.TravelTime == 0) data.TravelTime = existingRide.TravelTime;

                var updatedRide = await ridesRepository.UpdateRideAsync(_mapper.Map<Ride>(data));
                return updatedRide.Id != 0 ? _mapper.Map<RideDataDto>(updatedRide) : new RideDataDto { Id = 0 };
            }
            catch
            {
                return new RideDataDto { Id = 0 };
            }
        }

        public async Task<List<RideDataDto>> GetRides(int userId, string role)
        {
            try
            {
                var ridesRepository = new RidesRepository();

                List<Ride> rides = role switch
                {
                    "Admin" => await ridesRepository.GetAllRidesAsync(),
                    "User" => await ridesRepository.FilterRidesAsync(r => r.UserId == userId),
                    "Driver" => await ridesRepository.FilterRidesAsync(r => r.DriverId == userId && r.RideStatus == StatusOfRide.Done),
                    _ => new List<Ride>()
                };

                return _mapper.Map<List<RideDataDto>>(rides);
            }
            catch
            {
                return new List<RideDataDto>();
            }
        }

        public async Task<List<RideDataDto>> GetAvailableRides()
        {
            try
            {
                var rides = await new RidesRepository().FilterRidesAsync(r => r.RideStatus == StatusOfRide.Created);
                return _mapper.Map<List<RideDataDto>>(rides);
            }
            catch
            {
                return new List<RideDataDto>();
            }
        }

        public async Task<RideDataDto> AcceptExistingRide(int rideId, int driverId)
        {
            try
            {
                if (rideId == 0 || driverId == 0) return new RideDataDto { Id = 0 };

                var ridesRepository = new RidesRepository();
                var ride = await ridesRepository.GetRideByIdAsync(rideId);
                if (ride.Id == 0) return new RideDataDto { Id = 0 };

                var driver = await _usersServices.GetUserById(driverId);
                if (driver.Id == 0)
                    return new RideDataDto { Id = 0 };

                ride.RideStatus = StatusOfRide.InProgress;
                ride.DriverId = driverId;
                ride.TravelTime = new Random().Next(10, 60);

                var updatedRide = await ridesRepository.UpdateRideAsync(ride);
                return updatedRide.Id != 0 ? _mapper.Map<RideDataDto>(updatedRide) : new RideDataDto { Id = 0 };
            }
            catch
            {
                return new RideDataDto { Id = 0 };
            }
        }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners() => this.CreateServiceRemotingInstanceListeners();

        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
    }
}
