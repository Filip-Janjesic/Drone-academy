using Drone_academy.Data;
using Drone_academy.Models;
using Microsoft.AspNetCore.Mvc;

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
            // If you decide to keep this method, remove the authorization logic and return a different response
            return Ok("Authorization logic removed. Modify this method as needed.");
        }
    }
}
