using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Pozajmljuje")]
    public class Pozajmljuje
    {
       [Key]
       public int ID { get; set; }

       public Citalac Citalac { get; set; }

       public Knjiga Knjiga { get; set; }

       public DateTime DatumVracanja { get; set; }

       public Biblioteka Biblioteka { get; set; }
    }
}