using Common.Model;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace RideServiceStateless.RideServiceDB
{
    public class RidesRepository
    {
        public RidesRepository() {
            using (var context = new RideDbContext())
            {
                context.Database.EnsureCreated();

            }
        }
        public async Task<Ride> GetRideByIdAsync(int id)
        {
            using var context = new RideDbContext();
            return await context.Rides.FindAsync(id) ?? new() { Id = 0 };
        }


        public async Task<List<Ride>> GetAllRidesAsync()
        {

            using var context = new RideDbContext();
            return await context.Rides.AsNoTracking().ToListAsync();
        }

        public async Task<Ride> AddRideAsync(Ride ride)
        {

            if (ride == null)
                return new() { Id = 0 };

            using var context = new RideDbContext();

            var added = context.Rides.Add(ride);


            if (await context.SaveChangesAsync() > 0)
                return added.Entity;

            return new() { Id = 0 };
        }

        public async Task<Ride> UpdateRideAsync(Ride ride)
        {
            if (ride == null)
                return new() { Id = 0 };


            using var context = new RideDbContext();
            context.Entry(ride).State = EntityState.Modified;

            if (await context.SaveChangesAsync() > 0)
                return ride;
            else
                return new() { Id = 0 };
        }

        public async Task<bool> DeleteRideAsync(int id)
        {
            using var context = new RideDbContext();
            var ride = await context.Rides.FindAsync(id);
            if (ride != null)
            {
                context.Rides.Remove(ride);
                return await context.SaveChangesAsync() > 0;
            }
            else
                return false;
        }

        public async Task<Ride> FilterRideAsync(Expression<Func<Ride, bool>> filter)
        {
            using var context = new RideDbContext();
            return await context.Rides.AsNoTracking().FirstOrDefaultAsync(filter) ?? new() { Id = 0 };
        }

        public async Task<List<Ride>> FilterRidesAsync(Expression<Func<Ride, bool>> filter)
        {
            using var context = new RideDbContext();
            return await context.Rides.AsNoTracking().Where(filter).ToListAsync();
        }
    }
}
