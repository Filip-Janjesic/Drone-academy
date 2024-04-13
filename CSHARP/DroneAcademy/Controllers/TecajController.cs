using Drone_academy.Data;
using Drone_academy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text;


namespace Drone_academy.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TecajController : DroneAcademyController<Tecaj, TecajDTORead, TecajDTOInsertUpdate>
    {
        public TecajController(DroneAcademyContext context) : base(context)
        {
            DbSet = _context.Tecajevi;
        }


        [HttpGet]
        [Route("Oznake/{sifraTecaja:int}")]
        public IActionResult GetOznake(int sifraTecaja)
        {
            if (!ModelState.IsValid || sifraTecaja <= 0)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var oznake = _context.TecajeviOznake
                    .Include(i => i.Oznaka)
                    .Include(i => i.Tecaj)
                    .Where(x => x.Tecaj.Sifra == sifraTecaja).ToList();
                if (oznake == null)
                {
                    return BadRequest("Ne postoje oznake s šifrom " + sifraTecaja + " u bazi");
                }

                List<TecajOznakaDTORead> lista = new List<TecajOznakaDTORead>();
                oznake.ForEach(x => lista.Add(new TecajOznakaDTORead(x.Sifra, x.Oznaka.Naziv, x.napomena)));

                return new JsonResult(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                    ex.Message);
            }
        }

        [HttpPost]
        [Route("DodajOznaku")]
        public IActionResult DodajOznaku(TecajOznakaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var tecaj = _context.Tecajevi.Find(dto.tecajSifra);

                if (tecaj == null)
                {
                    throw new Exception("Ne postoji tečaj s šifrom " + dto.tecajSifra + " u bazi");
                }

                var oznaka = _context.Oznake.Find(dto.oznakaSifra);

                if (oznaka == null)
                {
                    throw new Exception("Ne postoji oznaka s šifrom " + dto.oznakaSifra + " u bazi");
                }

                var entitet = new TecajOznaka() { Tecaj = tecaj, Oznaka = oznaka, napomena = dto.napomena };

                _context.TecajeviOznake.Add(entitet);
                _context.SaveChanges();

                return new JsonResult(new TecajOznakaDTORead(entitet.Sifra, entitet.Oznaka.Naziv, entitet.napomena));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpDelete]
        [Route("ObrisiOznaku/{sifra:int}")]
        public IActionResult ObrisiOznaku(int sifra)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (sifra <= 0)
            {
                return BadRequest("Šifra oznake nije dobra");
            }

            try
            {

                var entitet = _context.TecajeviOznake.Find(sifra);

                if (entitet == null)
                {
                    return BadRequest("Ne postoji oznaka na smjeru s šifrom " + sifra + " u bazi");
                }

                _context.TecajeviOznake.Remove(entitet);
                _context.SaveChanges();

                return Ok("Obrisano");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpPatch]
        [Route("PromjeniOznaku/{sifra:int}")]
        public IActionResult PromjeniOznaku(int sifra, string napomena)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {

                var entitet = _context.TecajeviOznake.Include(x => x.Oznaka).FirstOrDefault(x => x.Sifra == sifra);

                if (entitet == null)
                {
                    return BadRequest("Ne postoji oznaka na na tečaju s šifrom " + sifra + " u bazi");
                }

                entitet.napomena = napomena;

                _context.TecajeviOznake.Update(entitet);
                _context.SaveChanges();

                return new JsonResult(new TecajOznakaDTORead(entitet.Sifra, entitet.Oznaka.Naziv, entitet.napomena));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        protected override void KontrolaBrisanje(Tecaj entitet)
        {
            var lista = _context.Grupe.Include(x => x.Tecaj).Where(x => x.Tecaj.Sifra == entitet.Sifra).ToList();

            if (lista != null && lista.Count() > 0)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("Tečaj se ne može obrisati jer je postavljen na grupama: ");
                foreach (var e in lista)
                {
                    sb.Append(e.Naziv).Append(", ");
                }

                throw new Exception(sb.ToString().Substring(0, sb.ToString().Length - 2));
            }
        }








    }
}
