using Drone_academy.Data;
using Microsoft.EntityFrameworkCore;
using Drone_academy.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddEdunovaSwaggerGen();
builder.Services.AddEdunovaCORS();
builder.Services.AddDbContext<DroneAcademyContext>(o => o.UseSqlServer(builder.Configuration.GetConnectionString(name: "EdunovaContext")));
builder.Services.AddAuthentication(x => {
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("MojKljucKojijeJakoTajan i dovoljno dugaèak da se može koristiti")),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = false
    };
});
builder.Services.AddAuthorization();
var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI(opcije =>
{
    opcije.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
    opcije.ConfigObject.
    AdditionalItems.Add("requestSnippetsEnabled", true);
});
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.UseCors("CorsPolicy");
app.UseDefaultFiles();
app.UseDeveloperExceptionPage();
app.MapFallbackToFile("index.html");
app.Run();
