using Drone_academy.Models;
using Microsoft.EntityFrameworkCore;


namespace Drone_academy.Data
{
    public class DroneAcademyContext:DbContext
    {

        public DroneAcademyContext(DbContextOptions<DroneAcademyContext> options)
            : base(options)
        {

        }

        public DbSet<Tecaj> Tecajevi { get; set; }

        public DbSet<Instruktor> Instruktori { get; set; }

        public DbSet<Kandidat> Kandidati { get; set; }

        public DbSet<Grupa> Grupe { get; set; }

        public DbSet<Oznaka> Oznake { get; set; }

        public DbSet<TecajOznaka> TecajeviOznake { get; set; }

        public DbSet<Operater> Operateri { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Grupa>().HasOne(g => g.Tecaj);
            modelBuilder.Entity<Grupa>().HasOne(g => g.Instruktor);

            modelBuilder.Entity<Grupa>()
                .HasMany(g => g.Kandidati)
                .WithMany(p => p.Grupe)
                .UsingEntity<Dictionary<string, object>>("clanovi",
                c => c.HasOne<Kandidati>().WithMany().HasForeignKey("polaznik"),
                c => c.HasOne<Grupa>().WithMany().HasForeignKey("grupa"),
                c => c.ToTable("clanovi")
                );

            modelBuilder.Entity<TecajOznaka>().HasOne(x => x.Tecaj);
            modelBuilder.Entity<TecajOznaka>().HasOne(x => x.Oznaka);

        }

    }
}
