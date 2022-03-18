using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Biblioteka.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KnjigaController : ControllerBase
    {
        public BibliotekaContext Context { get; set; }
        public KnjigaController(BibliotekaContext context)
        {
            Context = context;
        }
        [EnableCors("CORS")]
        [Route("PreuzmiKnjige/{BibliotekaID}")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiKnjige(int BibliotekaID)
       { 
         try
         {
           var biblioteka = await Context.Biblioteke.Where(p => p.ID == BibliotekaID).FirstAsync();
                if (biblioteka == null)
                    throw new Exception("Biblioteka ne postoji!");
                var knjige = await Context.Knjige.Where(p => p.Biblioteka.ID == BibliotekaID).Select(
                    p => new{
                    p.ID,
                    p.Naslov,
                    p.ImePisca,
                    p.Tip,
                }).ToListAsync();
                return Ok(knjige);
         }
         
         catch (Exception e)
         {
           return BadRequest(e.Message);
         }
        }
        
        [EnableCors("CORS")]
        [Route("Dodajknjigu/{Naslov}/{ImePisca}/{Tip}/{IDBiblioteke}")]
        [HttpPost]  
        public async Task<ActionResult> DodajKnjigu(string Naslov, string ImePisca, string Tip, int IDBiblioteke)
        {
            if (string.IsNullOrWhiteSpace(Naslov) || Naslov.Length > 30)
                return BadRequest($"Parametar 'Naslov knjige' : {Naslov} nije validan!");
            if (string.IsNullOrWhiteSpace(ImePisca) || ImePisca.Length > 100)
                return BadRequest($"Parametar 'Ime Pisca' : {ImePisca} nije validan!");
            if (string.IsNullOrWhiteSpace(Tip) || Tip.Length > 30)
                return BadRequest($"Parametar 'Tip' : {Tip} nije validan!");
            try
            {
                var biblioteka = await Context.Biblioteke.Where(p => p.ID == IDBiblioteke).FirstOrDefaultAsync();
                if (biblioteka == null)
                    throw new Exception("Ne postoji biblioteka sa tim ID-jem!");

                Knjiga knji = new Knjiga();
                knji.Naslov = Naslov;
                knji.ImePisca = ImePisca;
                knji.Tip = Tip;
                knji.Biblioteka = biblioteka;

                Context.Knjige.Add(knji);
                biblioteka.ListaKnjiga.Add(knji);

                await Context.SaveChangesAsync();

                return Ok($"Dodata Knjiga: {knji.ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [EnableCors("CORS")]
        [Route("Obrisiknjigu/{IDKnjige}")]
        [HttpDelete] 
        public async Task<ActionResult> ObrisiKnjigu(int IDKnjige)
        {
           try
            {
                var knjiga = await Context.Knjige.Where(p => p.ID == IDKnjige).FirstAsync();
                if(knjiga == null)
                   throw new Exception("Ne postoji knjiga sa unetim ID-jem");
                var ListaPozajmljuje = await Context.PozajmljenjeKnjige.Where(p => p.Knjiga.ID == IDKnjige).ToListAsync();
                
                foreach ( var pozajmica in ListaPozajmljuje)
                {
                    Context.Remove(pozajmica);
                }
                Context.Remove(knjiga);
                await Context.SaveChangesAsync();
                return Ok($"Obrisana je knjiga {IDKnjige}!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
       
      

    }
}

    
    
