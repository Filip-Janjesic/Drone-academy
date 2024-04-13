using Drone_academy.Data;
using Drone_academy.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Drone_academy.Controllers
{
    public class OznakaController : DroneAcademyController<Oznaka, OznakaDTORead, OznakaDTOInsertUpdate>
    {

        public OznakaController(DroneAcademyContext context) : base(context)
        {
            DbSet = _context.Oznake;
        }

        [HttpGet]
        [Route("trazi/{uvjet}")]
        public IActionResult TraziOznaka(string uvjet)
        {

            if (uvjet == null || uvjet.Length < 3)
            {
                return BadRequest(ModelState);
            }

            uvjet = uvjet.ToLower();
            try
            {
                var oznake = _context.Oznake.Where(p => p.Naziv.ToLower().Contains(uvjet)).ToList();

                return new JsonResult(_mapper.MapReadList(oznake)); //200

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        protected override void KontrolaBrisanje(Oznaka entitet)
        {
            var lista = _context.TecajeviOznake
                .Include(x => x.Oznaka)
                .Include(x => x.Tecaj)
                .Where(x => x.Oznaka.Sifra == entitet.Sifra).ToList();

            if (lista != null && lista.Count() > 0)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("Oznaka se ne može obrisati jer je postavljen na tečajevima: ");
                foreach (var e in lista)
                {
                    sb.Append(e.Tecaj.Naziv).Append(", ");
                }

                throw new Exception(sb.ToString().Substring(0, sb.ToString().Length - 2));
            }
        }

    }
}
