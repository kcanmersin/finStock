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
using Service.ExternalAPI;

namespace Service.Extensions
{
    public static class ServiceLayerExtensions
    {
        public static IServiceCollection LoadServiceLayerExtension(this IServiceCollection services, IConfiguration configuration)
        {
            var assembly = Assembly.GetExecutingAssembly();

            // Add services for dependency injection
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IImageHelper, ImageHelper>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IPortfolioService, PortfolioService>();
            services.AddScoped<ITransactionService, TransactionService>(); 
          //  services.AddScoped<IStockHoldingService, StockHoldingService>(); 
            services.AddScoped<IStockApiService, StockApiService>(); 
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //stockapiservice
            services.AddScoped<IStockApiService, StockApiService>();
            // Configure JWT settings
            var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>();
            services.AddSingleton(jwtSettings);

            // Register AutoMapper
            services.AddAutoMapper(assembly);

            // FluentValidation configuration
            services.AddControllersWithViews()
                .AddFluentValidation(opt =>
                {
                    opt.DisableDataAnnotationsValidation = true;
                    opt.ValidatorOptions.LanguageManager.Culture = new CultureInfo("tr");
                });

            // Register HttpClient for StockApiService
            services.AddHttpClient<IStockApiService, StockApiService>(client =>
            {
                client.BaseAddress = new Uri("https://finnhub.io/api/v1/"); 
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            });

            return services;
        }
    }
}
