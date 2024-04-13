namespace Drone_academy.Models
{
    public class Kandidat:Osoba
    {
        public string? BrojUgovora { get; set; }
        public ICollection<Grupa>? Grupe { get; } = new List<Grupa>();
    }
}
