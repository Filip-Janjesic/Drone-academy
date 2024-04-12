using Drone_academy.Data;
using Drone_academy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Drone_academy.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AutorizacijaController : ControllerBase
    {
        private readonly DroneAcademyContext _context;

        public AutorizacijaController(DroneAcademyContext context)
        {
            _context = context;
        }

        [HttpPost("token")]
        public IActionResult GenerirajToken(OperaterDTO operater)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var operBaza = _context.Operateri
                   .Where(p => p.Email!.Equals(operater.email))
                   .FirstOrDefault();

            if (operBaza == null)
            {

                return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani, ne mogu naći operatera");
            }



            if (!BCrypt.Net.BCrypt.Verify(operater.password, operBaza.Lozinka))
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani, lozinka ne odgovara");
            }


            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("MojKljucKojijeJakoTajan i dovoljno dugačak da se može koristiti");


            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Expires = DateTime.UtcNow.Add(TimeSpan.FromHours(8)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);


            return Ok(jwt);


        }
    }
}
