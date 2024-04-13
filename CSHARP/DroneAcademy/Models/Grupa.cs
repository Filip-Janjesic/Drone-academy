using System.ComponentModel.DataAnnotations.Schema;

namespace Drone_academy.Models
{
    public class Grupa:Entitet
    {
        public string? Naziv { get; set; }

        [ForeignKey("instruktor")]
        public Instruktor? Instruktor { get; set; }

        [ForeignKey("tecaj")]
        public Tecaj? Tecaj { get; set; }

        public int? MaksimalnoKandidata { get; set; }

        public DateTime? DatumPocetka { get; set; }

        public List<Kandidat>? Kandidati { get; set; }
    }
}
