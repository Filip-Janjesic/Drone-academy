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
    public class KandidatController : DroneAcademyController<Kandidat, KandidatDTORead, KandidatDTOInsertUpdate>
    {
        public KandidatController(DroneAcademyContext context) : base(context)
        {
            DbSet = _context.Kandidati;
            _mapper = new MappingKandidat();
        }

        [HttpGet]
        [Route("trazi/{uvjet}")]
        public IActionResult TraziKandidat(string uvjet)
        {

            if (uvjet == null || uvjet.Length < 3)
            {
                return BadRequest(ModelState);
            }

            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Kandidat> query = _context.Kandidati;
                var niz = uvjet.Split(" ");

                foreach (var s in uvjet.Split(" "))
                {
                    query = query.Where(p => p.Ime.ToLower().Contains(s) || p.Prezime.ToLower().Contains(s));
                }


                var kandidati = query.ToList();

                return new JsonResult(_mapper.MapReadList(kandidati));

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpPut]
        [Route("postaviSliku/{sifra:int}")]
        public IActionResult PostaviSliku(int sifra, SlikaDTO slika)
        {
            if (sifra <= 0)
            {
                return BadRequest("Šifra mora biti veća od nula (0)");
            }
            if (slika.Base64 == null || slika.Base64?.Length == 0)
            {
                return BadRequest("Slika nije postavljena");
            }
            var p = _context.Kandidati.Find(sifra);
            if (p == null)
            {
                return BadRequest("Ne postoji kandidat s šifrom " + sifra + ".");
            }
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string dir = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "kandidati");

                if (!System.IO.Directory.Exists(dir))
                {
                    System.IO.Directory.CreateDirectory(dir);
                }
                var putanja = Path.Combine(dir + ds + sifra + ".png");
                System.IO.File.WriteAllBytes(putanja, Convert.FromBase64String(slika.Base64));
                return Ok("Uspješno pohranjena slika");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("traziStranicenje/{stranica}")]
        public IActionResult TraziKandidatStranicenje(int stranica, string uvjet = "")
        {
            var poStranici = 8;
            uvjet = uvjet.ToLower();
            try
            {
                var kandidati = _context.Kandidati
                    .Where(p => EF.Functions.Like(p.Ime.ToLower(), "%" + uvjet + "%")
                                || EF.Functions.Like(p.Prezime.ToLower(), "%" + uvjet + "%"))
                    .Skip((poStranici * stranica) - poStranici)
                    .Take(poStranici)
                    .OrderBy(p => p.Prezime)
                    .ToList();


                return new JsonResult(_mapper.MapReadList(kandidati));

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        protected override void KontrolaBrisanje(Kandidat entitet)
        {
            var entitetIzbaze = _context.Kandidati.Include(x => x.Grupe).FirstOrDefault(x => x.Sifra == entitet.Sifra);

            if (entitetIzbaze == null)
            {
                throw new Exception("Ne postoji kandidat s šifrom " + entitet.Sifra + " u bazi");
            }


            if (entitetIzbaze.Grupe != null && entitetIzbaze.Grupe.Count() > 0)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("Kandidat se ne može obrisati jer je postavljen na grupama: ");
                foreach (var e in entitetIzbaze.Grupe)
                {
                    sb.Append(e.Naziv).Append(", ");
                }

                throw new Exception(sb.ToString().Substring(0, sb.ToString().Length - 2));
            }
        }

    }
}
