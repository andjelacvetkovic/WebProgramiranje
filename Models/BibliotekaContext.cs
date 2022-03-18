using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class BibliotekaContext : DbContext
    {
        public DbSet<Biblioteka> Biblioteke { get; set; }
        public DbSet<Citalac> Citaoci { get; set; }
        public DbSet<Knjiga> Knjige { get; set; }
        public DbSet<Pozajmljuje> PozajmljenjeKnjige { get; set; }

        public BibliotekaContext(DbContextOptions options) : base(options)
        {

        } 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}