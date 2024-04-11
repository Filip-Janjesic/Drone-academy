using Microsoft.AspNetCore.Mvc;

namespace Drone_academy.Controllers
{
    public class InstruktorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
