using AutoMapper;
using Drone_academy.Models;

namespace Drone_academy.Mappers
{
    public class MappingInstruktor : Mapping<Instruktor, InstruktorDTORead, InstruktorDTOInsertUpdate>
    {

        public MappingInstruktor()
        {
            MapperMapReadToDTO = new Mapper(
            new MapperConfiguration(c =>
            {
                c.CreateMap<Instruktor, InstruktorDTORead>()
                .ConstructUsing(entitet =>
                 new InstruktorDTORead(
                    entitet.Sifra,
                    entitet.Ime,
                    entitet.Prezime,
                    entitet.Email,
                    entitet.Oib,
                    entitet.Iban,
                    PutanjaDatoteke(entitet)));
            })
            );
        }

        private static string PutanjaDatoteke(Instruktor e)
        {
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string dir = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "datoteke" + ds + "instruktori" + ds);
                DirectoryInfo d = new DirectoryInfo(dir);
                FileInfo[] Files = d.GetFiles(e.Sifra + "_*");
                return Files != null && Files.Length > 0 ? "/datoteke/instruktori/" + Files[0].Name : null;
            }
            catch
            {
                return null;
            }

        }






    }
}
