using Microsoft.AspNetCore.Mvc;

namespace Drone_academy.Controllers
{
    public class DroneAcademyController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
