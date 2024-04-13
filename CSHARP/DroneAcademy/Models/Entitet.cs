using System.ComponentModel.DataAnnotations;

namespace Drone_academy.Models
{
    public abstract class Entitet
    {
        [Key]
        public int Sifra { get; set; }
    }
}
