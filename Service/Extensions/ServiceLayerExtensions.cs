using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;
using System.Reflection;
using Service.FluentValidations;
using Service.Helpers.Images;
using Service.Services.Abstractions;
using Service.Services.Concrete;
using Service.Helpers.Images;
using Service.Services.Abstractions;
using Service.Services.Concrete;
using Service.Authentication;
using Microsoft.Extensions.Configuration;
using Entity.Configuration;

namespace Service.Extensions
{
    public static class ServiceLayerExtensions
    {
        public static IServiceCollection LoadServiceLayerExtension(this IServiceCollection services, IConfiguration configuration)
        {
            var assembly = Assembly.GetExecutingAssembly();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IImageHelper, ImageHelper>();
            services.AddScoped<IJwtService, JwtService>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>();
            services.AddSingleton(jwtSettings);

            services.AddAutoMapper(assembly);
            services.AddControllersWithViews()
                .AddFluentValidation(opt =>
                {
                    opt.DisableDataAnnotationsValidation = true;
                    opt.ValidatorOptions.LanguageManager.Culture = new CultureInfo("tr");
                });

            return services;
        }

    }
}
