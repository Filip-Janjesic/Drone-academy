using Drone_academy.Data;
using Microsoft.EntityFrameworkCore;
using Drone_academy.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDroneAcademySwaggerGen();
builder.Services.AddDroneAcademyCORS();
builder.Services.AddDbContext<DroneAcademyContext>(o => o.UseSqlServer(builder.Configuration.GetConnectionString(name: "DroneAcademyExtensions")));

// Remove authentication related configuration
// builder.Services.AddAuthentication(...)
// builder.Services.AddAuthorization(...)
// builder.Services.AddJwtBearer(...)

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI(opcije =>
{
    opcije.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
    opcije.ConfigObject.
    AdditionalItems.Add("requestSnippetsEnabled", true);
});
app.UseHttpsRedirection();
// Remove app.UseAuthentication() and app.UseAuthorization()
app.MapControllers();
app.UseStaticFiles();
app.UseCors("CorsPolicy");
app.UseDefaultFiles();
app.UseDeveloperExceptionPage();
app.MapFallbackToFile("index.html");
app.Run();
