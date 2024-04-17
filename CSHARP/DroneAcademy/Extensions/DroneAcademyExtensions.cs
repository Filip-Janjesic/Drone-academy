using Microsoft.OpenApi.Models;
using System.Reflection;

namespace Drone_academy.Extensions
{
    public static class DroneAcademyExtensions
    {

        public static void AddDroneAcademySwaggerGen(this IServiceCollection Services)
        {

            Services.AddSwaggerGen(sgo =>
            {
                var o = new Microsoft.OpenApi.Models.OpenApiInfo()
                {
                    Title = "Drone Academy",
                    Version = "v1",
                    Contact = new Microsoft.OpenApi.Models.OpenApiContact()
                    {
                        Email = "filip.janjesic@gmail.com",
                        Name = "Filip Janješić"
                    },
                    Description = "Drone Academy",
                    License = new Microsoft.OpenApi.Models.OpenApiLicense()
                    {
                        Name = "Pilotska licenca"
                    }
                };
                sgo.SwaggerDoc("v1", o);

                // Remove the security definitions and requirements related to JWT authorization
                // Remove sgo.AddSecurityDefinition("Bearer", ...)
                // Remove sgo.AddSecurityRequirement(new OpenApiSecurityRequirement() { ... });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                sgo.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);

            });

        }

        public static void AddDroneAcademyCORS(this IServiceCollection Services)
        {

            Services.AddCors(opcije =>
            {
                opcije.AddPolicy("CorsPolicy",
                    builder =>
                        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
                );

            });

        }
    }
}
