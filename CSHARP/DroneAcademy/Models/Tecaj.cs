using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Drone_academy.Models
{
    public class Tecaj:Entitet
    {
        public string? Naziv { get; set; }
        [Column("brojsati")]
        public int? Trajanje { get; set; }
        public decimal? Cijena { get; set; }
        public decimal? Upisnina { get; set; }
    }
}
