using AutoMapper;
using Drone_academy.Models;

namespace Drone_academy.Mappers
{
    public class MappingGrupa : Mapping<Grupa, GrupaDTORead, GrupaDTOInsertUpdate>
    {

        public MappingGrupa()
        {
            MapperMapReadToDTO = new Mapper(
            new MapperConfiguration(c =>
            {
                c.CreateMap<Grupa, GrupaDTORead>()
                .ConstructUsing(entitet =>
                 new GrupaDTORead(
                    entitet.Sifra,
                    entitet.Naziv,
                    entitet.Tecaj == null ? "" : entitet.Tecaj.Naziv,
                    entitet.Instruktor == null ? "" : (entitet.Instruktor.Ime + " " + entitet.Instruktor.Prezime).Trim(),
                    entitet.Kandidati!.Count(),
                    entitet.DatumPocetka,
                    entitet.MaksimalnoKandidata == null ? 0 : entitet.MaksimalnoKandidata));
            })
            );
            MapperMapInsertUpdatedFromDTO = new Mapper(
                new MapperConfiguration(c =>
                {
                    c.CreateMap<GrupaDTOInsertUpdate, Grupa>();
                })
                );

            MapperMapInsertUpdateToDTO = new Mapper(
             new MapperConfiguration(c =>
             {
                 c.CreateMap<Grupa, GrupaDTOInsertUpdate>()
                 .ConstructUsing(entitet =>
                  new GrupaDTOInsertUpdate(
                     entitet.Naziv,
                     entitet.Tecaj == null ? null : entitet.Tecaj.Sifra,
                     entitet.Instruktor == null ? null : entitet.Instruktor.Sifra,
                     entitet.DatumPocetka,
                     entitet.MaksimalnoKandidata))
                 ;
             })
             );
        }

    }
}
