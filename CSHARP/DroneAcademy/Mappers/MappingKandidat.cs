using AutoMapper;
using Drone_academy.Models;

namespace Drone_academy.Mappers
{
    public class MappingKandidat : Mapping<Kandidat, KandidatDTORead, KandidatDTOInsertUpdate>
    {

        public MappingKandidat()
        {
            MapperMapReadToDTO = new Mapper(
            new MapperConfiguration(c =>
            {
                c.CreateMap<Kandidat, KandidatDTORead>()
                .ConstructUsing(entitet =>
                 new KandidatDTORead(
                    entitet.Sifra,
                    entitet.Ime,
                    entitet.Prezime,
                    entitet.Email,
                    entitet.Oib,
                    entitet.BrojUgovora,
                    PutanjaDatoteke(entitet)));
            })
            );

            MapperMapInsertUpdateToDTO = new Mapper(
              new MapperConfiguration(c =>
              {
                  c.CreateMap<Kandidat, KandidatDTOInsertUpdate>()
               .ConstructUsing(entitet =>
                new KandidatDTOInsertUpdate(
                   entitet.Ime,
                   entitet.Prezime,
                   entitet.Email,
                   entitet.Oib,
                   entitet.BrojUgovora,
                   PutanjaDatoteke(entitet)));
              })
              );
        }


        private static string PutanjaDatoteke(Kandidat e)
        {
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string slika = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "kandidati" + ds + e.Sifra + ".png");
                return File.Exists(slika) ? "/slike/kandidati/" + e.Sifra + ".png" : null;
            }
            catch
            {
                return null;
            }

        }

    }
}
