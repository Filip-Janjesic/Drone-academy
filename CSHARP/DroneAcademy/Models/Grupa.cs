using System.ComponentModel.DataAnnotations.Schema;

namespace Drone_academy.Models
{
    public class Grupa:Entitet
    {
        public string? Naziv { get; set; }

        [ForeignKey("instruktor")] // ovo pod navodnicima je naziv kolone u tablici grupa
        public Instruktor? Instruktor { get; set; }

        [ForeignKey("tecaj")]
        public Tecaj? Tecaj { get; set; }

        public int? MaksimalnoKandidata { get; set; }

        public DateTime? DatumPocetka { get; set; }

        public List<Kandidat>? Polaznici { get; set; }
    }
}
