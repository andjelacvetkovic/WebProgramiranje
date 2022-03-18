using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Library.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BibliotekaController : ControllerBase
    {
       public BibliotekaContext Context { get; set; }
       public BibliotekaController(BibliotekaContext context)
       {
          Context=context;   
       }

      [Route("PreuzmiBiblioteke")]
      [EnableCors("CORS")]
      [HttpGet]
      public async Task<ActionResult> PreuzmiBiblioteke()
       { 
         try
         {
           var biblioteke = Context.Biblioteke.Select(p => new { p.ID, p.Ime, p.Adresa});
           return Ok(await biblioteke.ToListAsync());
         }
         
         catch (Exception e)
         {
           return BadRequest(e.Message);
         }
        }
    }
}
