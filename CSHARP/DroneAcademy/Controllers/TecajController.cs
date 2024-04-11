using Microsoft.AspNetCore.Mvc;

namespace Drone_academy.Controllers
{
    public class TecajController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
