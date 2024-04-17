using Drone_academy.Data;
using Drone_academy.Models;
using Drone_academy.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Drone_academy.Controllers
{
        
        public abstract class DroneAcademyController<T, TDR, TDI> : ControllerBase where T : Entitet
        {
            protected DbSet<T> DbSet;

            protected Mapping<T, TDR, TDI> _mapper;
            protected abstract void KontrolaBrisanje(T entitet);

            protected readonly DroneAcademyContext _context;

            public DroneAcademyController(DroneAcademyContext context)
            {
                _context = context;
                _mapper = new Mapping<T, TDR, TDI>();
            }

            [HttpGet]
            public IActionResult Get()
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                try
                {
                    return new JsonResult(UcitajSve());
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            [HttpGet]
            [Route("{sifra:int}")]
            public IActionResult GetBySifra(int sifra)
            {
                if (!ModelState.IsValid || sifra <= 0)
                {
                    return BadRequest(ModelState);
                }
                try
                {
                    var entitet = NadiEntitet(sifra);
                    return new JsonResult(_mapper.MapInsertUpdateToDTO(entitet));
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            [HttpPost]
            public IActionResult Post(TDI entitetDTO)
            {
                if (!ModelState.IsValid || entitetDTO == null)
                {
                    return BadRequest(ModelState);
                }
                try
                {
                    var entitet = KreirajEntitet(entitetDTO);
                    _context.Add(entitet);
                    _context.SaveChanges();
                    return StatusCode(StatusCodes.Status201Created,
                                           _mapper.MapReadToDTO(entitet));
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            [HttpPut]
            [Route("{sifra:int}")]
            public IActionResult Put(int sifra, TDI dto)
            {
                if (sifra <= 0 || !ModelState.IsValid || dto == null)
                {
                    return BadRequest(ModelState);
                }

                try
                {
                    var entitetIzBaze = NadiEntitet(sifra);
                    _context.Entry(entitetIzBaze).State = EntityState.Detached;
                    var entitet = PromjeniEntitet(dto, entitetIzBaze);
                    entitet.Sifra = sifra;
                    _context.Update(entitet);
                    _context.SaveChanges();

                    return StatusCode(StatusCodes.Status200OK, _mapper.MapReadToDTO(entitet));
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            [HttpDelete]
            [Route("{sifra:int}")]
            public IActionResult Delete(int sifra)
            {
                if (!ModelState.IsValid || sifra <= 0)
                {
                    return BadRequest();
                }
                try
                {
                    var entitetIzbaze = NadiEntitet(sifra);
                    KontrolaBrisanje(entitetIzbaze);
                    _context.Remove(entitetIzbaze);
                    _context.SaveChanges();
                    return Ok("Obrisano");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }


            protected virtual T NadiEntitet(int sifra)
            {
                var entitetIzbaze = DbSet.Find(sifra);
                if (entitetIzbaze == null)
                {
                    throw new Exception("Ne postoji entitet s šifrom " + sifra + " u bazi");
                }

                return entitetIzbaze;
            }

            protected virtual List<TDR> UcitajSve()
            {
                var lista = DbSet.ToList();
                if (lista == null || lista.Count == 0)
                {
                    throw new Exception("Ne postoje podaci u bazi");
                }
                return _mapper.MapReadList(lista);
            }

            protected virtual T KreirajEntitet(TDI dto)
            {
                return _mapper.MapInsertUpdatedFromDTO(dto);
            }

            protected virtual T PromjeniEntitet(TDI dto, T s)
            {
                return _mapper.MapInsertUpdatedFromDTO(dto);
            }

        }
    }
