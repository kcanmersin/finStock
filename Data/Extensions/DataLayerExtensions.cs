using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Data.Context;
using   Data.Repositories.Abstractions;
using   Data.Repositories.Concretes;
using   Data.UnitOfWorks;

namespace  Data.Extensions
{
    public static class DataLayerExtensions
    {
        public static IServiceCollection LoadDataLayerExtension(this IServiceCollection services, IConfiguration config)
        {
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            //services.AddDbContext<AppDbContext>(opt =>
            //    opt.UseSqlServer(
            //        config.GetConnectionString("DefaultConnection"),
            //        x => x.MigrationsAssembly("Data") 
            //    )
            //);
            services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(config.GetConnectionString("DefaultConnection")));

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            return services;
        }
    }
}
