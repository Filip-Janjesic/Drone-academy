using Drone_academy.Data;
using Drone_academy.Mappers;
using Drone_academy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;


namespace Drone_academy.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class InstruktorController : DroneAcademyController<Instruktor, InstruktorDTORead, InstruktorDTOInsertUpdate>
    {

        public InstruktorController(DroneAcademyContext context) : base(context)
        {
            DbSet = _context.Instruktori;
            _mapper = new MappingInstruktor();
        }

        protected override void KontrolaBrisanje(Instruktor entitet)
        {
            var lista = _context.Grupe.Include(x => x.Instruktor).Where(x => x.Instruktor.Sifra == entitet.Sifra).ToList();

            if (lista != null && lista.Count() > 0)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("Instruktor se ne može obrisati jer je postavljen na grupama: ");
                foreach (var e in lista)
                {
                    sb.Append(e.Naziv).Append(", ");
                }

                throw new Exception(sb.ToString().Substring(0, sb.ToString().Length - 2));
            }
        }
        [HttpPatch]
        [Route("{sifraInstruktor:int}")]
        public async Task<ActionResult> Patch(int sifraInstruktor, IFormFile datoteka)
        {
            if (datoteka == null)
            {
                return BadRequest("Datoteka nije postavljena");
            }

            var entitetIzbaze = _context.Instruktori.Find(sifraInstruktor);

            if (entitetIzbaze == null)
            {
                return BadRequest("Ne postoji predavač s šifrom " + sifraInstruktor + " u bazi");
            }
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string dir = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "datoteke" + ds + "instruktori");
                if (!System.IO.Directory.Exists(dir))
                {
                    System.IO.Directory.CreateDirectory(dir);
                }
                var putanja = Path.Combine(dir + ds + sifraInstruktor + "_" + System.IO.Path.GetExtension(datoteka.FileName));
                Stream fileStream = new FileStream(putanja, FileMode.Create);
                await datoteka.CopyToAsync(fileStream);
                return Ok("Datoteka pohranjena");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
