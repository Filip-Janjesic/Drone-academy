using Drone_academy.Validations;
using System.ComponentModel.DataAnnotations;


namespace Drone_academy.Models
{
    public record TecajDTORead(
            int sifra, string naziv, int? trajanje, decimal? cijena, decimal? upisnina);
    public record TecajDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
            string? naziv,
        [Range(30, 500, ErrorMessage = "{0} mora biti između {1} i {2}")]
        [Required(ErrorMessage = "trajanje obavezno")]
            int? trajanje,
        [Range(0, 10000, ErrorMessage = "Vrijednost {0} mora biti između {1} i {2}")]
            decimal? cijena,
            decimal? upisnina);


    public record KandidatDTORead(
        int sifra, string? ime, string? prezime,string? email, string? oib, string? brojugovora, string? slika);

    public record KandidatDTOInsertUpdate(
        [Required(ErrorMessage = "Ime obavezno")]
                string? ime,
        [Required(ErrorMessage = "Prezime obavezno")]
                string? prezime,
        [Required(ErrorMessage = "Email obavezno")]
            [EmailAddress(ErrorMessage ="Email nije dobrog formata")]
                string? email,
        [OibValidator]
                string? oib,
            string? brojugovora,
            string? slika);

    public record InstruktorDTORead(
        int sifra, string? ime, string? prezime,string? email, string? oib, string? iban, string? datoteka);

    public record InstruktorDTOInsertUpdate(
        [Required(ErrorMessage = "Ime obavezno")]
                string? ime,
        [Required(ErrorMessage = "Prezime obavezno")]
                string? prezime,
        [Required(ErrorMessage = "Email obavezno")]
            [EmailAddress(ErrorMessage ="Email nije dobrog formata")]
                string? email,
        [OibValidator]
                string? oib,
            string? iban);

    public record GrupaDTORead(int sifra, string? naziv,
        string? smjerNaziv, string? predavacImePrezime, int brojpolaznika, DateTime? datumpocetka, int? maksimalnopolaznika);
 
    public record GrupaDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
        string? naziv,
        int? tecajSifra,
        int? instruktorSifra,
        DateTime? datumpocetka,
        [Range(0, 30, ErrorMessage = "{0} mora biti između {1} i {2}")]
        int? maksimalnokandidata= 0);

    public record OznakaDTORead(int sifra, string? naziv);

    public record OznakaDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
        string? naziv
        );

    public record TecajOznakaDTORead(int sifra, string? oznaka, string? napomena);

    public record TecajOznakaDTOInsertUpdate(int tecajSifra, int oznakaSifra, [Required(ErrorMessage = "Napomena obavezno")] string? napomena);

    public record SlikaDTO([Required(ErrorMessage = "Base64 zapis slike obavezno")] string Base64);

    public record OperaterDTO(
        [Required(ErrorMessage = "Email obavezno")]
        string? email,
        [Required(ErrorMessage = "Lozinka obavezno")]
        string? password);

};


