using Drone_academy.Data;
using Drone_academy.Mappers;
using Drone_academy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text;


namespace Drone_academy.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class GrupaController : DroneAcademyController<Grupa, GrupaDTORead, GrupaDTOInsertUpdate>
    {
        public GrupaController(DroneAcademyContext context) : base(context)
        {
            DbSet = _context.Grupe;
            _mapper = new MappingGrupa();
        }
    }

    [HttpGet]
    [Route("Kandidati/{sifraGrupe:int}")]
    public IActionResult GetKandidati(int sifraGrupe)
    {
        if (!ModelState.IsValid || sifraGrupe <= 0)
        {
            return BadRequest(ModelState);
        }
        try
        {
            var p = _context.Grupe
                .Include(i => i.Kandidati).FirstOrDefault(x => x.Sifra == sifraGrupe);
            if (p == null)
            {
                return BadRequest("Ne postoji grupa s šifrom " + sifraGrupe + " u bazi");
            }
            var mapping = new MappingKandidati();
            return new JsonResult(mapping.MapReadList(p.Kandidati));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    [Route("{sifra:int}/dodaj/{kandidatSifra:int}")]
    public IActionResult DodajKandidata(int sifra, int kandidatSifra)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (sifra <= 0 || kandidatSifra <= 0)
        {
            return BadRequest("Šifra grupe ili polaznika ije dobra");
        }

        try
        {

            var grupa = _context.Grupe
                .Include(g => g.Kandidati)
                .FirstOrDefault(g => g.Sifra == sifra);

            if (grupa == null)
            {
                return BadRequest("Ne postoji grupa s šifrom " + sifra + " u bazi");
            }

            var kandidat = _context.Kandidati.Find(kandidatSifra);

            if (kandidat == null)
            {
                return BadRequest("Ne postoji kandidat s šifrom " + kandidatSifra + " u bazi");
            }

            grupa.Kandidati.Add(kandidat);

            _context.Grupe.Update(grupa);
            _context.SaveChanges();

            return Ok();

        }
        catch (Exception ex)
        {
            return StatusCode(
                   StatusCodes.Status503ServiceUnavailable,
                   ex.Message);

        }

    }


    [HttpDelete]
    [Route("{sifra:int}/obrisi/{kandidatSifra:int}")]
    public IActionResult ObrisiKandidata(int sifra, int kandidatSifra)
    {

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (sifra <= 0 || kandidatSifra <= 0)
        {
            return BadRequest("Šifra grupe ili kandidata nije dobra");
        }

        try
        {

            var grupa = _context.Grupe
                .Include(g => g.Kandidati)
                .FirstOrDefault(g => g.Sifra == sifra);

            if (grupa == null)
            {
                return BadRequest("Ne postoji grupa s šifrom " + sifra + " u bazi");
            }

            var kandidat = _context.Kandidati.Find(kandidatSifra);

            if (kandidat == null)
            {
                return BadRequest("Ne postoji polaznik s šifrom " + kandidatSifra + " u bazi");
            }


            grupa.Kandidati.Remove(kandidat);

            _context.Grupe.Update(grupa);
            _context.SaveChanges();

            return Ok();

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);

        }

    }

    protected override void KontrolaBrisanje(Grupa entitet)
    {
        if (entitet != null && entitet.Kandidati != null && entitet.Kandidati.Count() > 0)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("Grupa se ne može obrisati jer su na njon kandidati: ");
            foreach (var e in entitet.Kandidati)
            {
                sb.Append(e.Ime).Append(" ").Append(e.Prezime).Append(", ");
            }

            throw new Exception(sb.ToString().Substring(0, sb.ToString().Length - 2));
        }
    }

    protected override Grupa KreirajEntitet(GrupaDTOInsertUpdate dto)
    {
        var tecaj = _context.Tecajevi.Find(dto.tecajSifra) ?? throw new Exception("Ne postoji tečaj s šifrom " + dto.tecajSifra + " u bazi");
        var instruktor = _context.Instruktor.Find(dto.instruktorSifra) ?? throw new Exception("Ne postoji instruktor s šifrom " + dto.instruktorSifra + " u bazi");
        var entitet = _mapper.MapInsertUpdatedFromDTO(dto);
        entitet.Kandidati = new List<Kandidati>();
        entitet.Tecaj = tecaj;
        entitet.Instruktor = instruktor;
        return entitet;
    }

    protected override List<GrupaDTORead> UcitajSve()
    {
        var lista = _context.Grupe
                .Include(g => g.Tecaj)
                .Include(g => g.Instruktor)
                .Include(g => g.Kandidati)
                .ToList();
        if (lista == null || lista.Count == 0)
        {
            throw new Exception("Ne postoje podaci u bazi");
        }
        return _mapper.MapReadList(lista);
    }

    protected override Grupa NadiEntitet(int sifra)
    {
        return _context.Grupe.Include(i => i.Tecaj).Include(i => i.Instruktor)
                .Include(i => i.Kandidat).FirstOrDefault(x => x.Sifra == sifra) ?? throw new Exception("Ne postoji grupa s šifrom " + sifra + " u bazi");
    }
    protected override Grupa PromjeniEntitet(GrupaDTOInsertUpdate dto, Grupa entitet)
    {
        var tecaj = _context.Tecajevi.Find(dto.tecajSifra) ?? throw new Exception("Ne postoji tecaj s šifrom " + dto.tecajSifra + " u bazi");
        var instruktor = _context.Instruktori.Find(dto.instruktorSifra) ?? throw new Exception("Ne postoji instruktor s šifrom " + dto.instruktorSifra + " u bazi");
        entitet.MaksimalnoKandidata = dto.maksimalnokandidata;
        entitet.DatumPocetka = dto.datumpocetka;
        entitet.Naziv = dto.naziv;
        entitet.Tecaj = tecaj;
        entitet.Instruktor = instruktor;

        return entitet;
    }
}
