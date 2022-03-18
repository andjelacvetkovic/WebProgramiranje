using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Models
{
    [Table("Knjiga")]
    public class Knjiga
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        public string Naslov { get; set; }

        [Required]
        [MaxLength(50)]
        public string ImePisca { get; set; }
    
        [Required]
        [MaxLength(30)]
        public string Tip { get; set; }
        public List<Pozajmljuje> ListaCitalaca { get; set; }

        [Required]
        public Biblioteka Biblioteka { get; set; }

    }
}