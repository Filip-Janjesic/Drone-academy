using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Drone_academy.Models
{
    public class TecajOznaka:Entitet
    {
        [ForeignKey("tecaj")]
        public Tecaj? Tecaj { get; set; }
        [ForeignKey("oznaka")]
        public Oznaka? Oznaka { get; set; }
        public string? napomena { get; set; }

    }
}
