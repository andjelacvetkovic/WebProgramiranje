using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Models
{
    [Table("Citalac")]
    public class Citalac
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        public string Ime { get; set; }

        [Required]
        [MaxLength(30)]
        public string ImeRoditelja { get; set; }

        [Required]
        [MaxLength(30)]
        public string Prezime { get; set; }

        [Required]
        [MaxLength(13)]
        [RegularExpression("\\d+")]
        public string BrojTelefona { get; set; }

        public List<Pozajmljuje> ListaKnjiga { get; set; }

        }
}