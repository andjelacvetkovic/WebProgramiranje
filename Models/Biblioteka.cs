using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Models
{
    [Table("Biblioteka")]
    public class Biblioteka
    {
        [Key]
        public int ID { get; set; }
        
        [Required]
        [MaxLength(30)]
        public string Ime { get; set; }

        [Required]
        [MaxLength(100)]
        public string Adresa { get; set; }

        public List<Knjiga> ListaKnjiga { get; set; }

        public List<Citalac> ListaCitaoca { get; set; }

    }
}