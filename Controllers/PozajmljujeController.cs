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
    public class PozajmljujeController : ControllerBase
    {
        public BibliotekaContext Context { get; set; }

        public PozajmljujeController(BibliotekaContext context)
        {
            Context = context;
        }
      
    [HttpGet]
    [EnableCors("CORS")]
    [Route("VratiCitaoceBezKnjiga")]
    public async Task<ActionResult> VratiCitaoceBezKnjiga()
    {
        try
        {
            var citaoci = await Context.Citaoci.Where(p => p.ListaKnjiga.Count == 0).ToListAsync();
                return Ok(citaoci);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
    }

    [HttpPost]
    [EnableCors("CORS")]
    [Route("UclaniCitaoca/{CitalacID}/{KnjigaID}")]
    public async Task<ActionResult> PozajmiKnjiguCitaocu(int CitalacID, int KnjigaID)
        {//pozajmi knjigu citaocu
        try
        {
            var citalac = await Context.Citaoci.Where(p => p.ID == CitalacID).FirstAsync();
            if (citalac == null)
                throw new Exception("Ne postoji citalac sa tim ID-jem!");
            var knjiga = await Context.Knjige.Where(p => p.ID == KnjigaID).FirstAsync();
            if (knjiga == null)
                throw new Exception("Ne postoji knjiga sa tim ID-jem!");
            Pozajmljuje p = new Pozajmljuje();
            p.Citalac = citalac;
            p.Knjiga = knjiga;
            p.DatumVracanja = DateTime.Today;
            Context.PozajmljenjeKnjige.Add(p);
            await Context.SaveChangesAsync();
                return Ok($"Citalac je uspesno pozajmio knjigu!");
            }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
       }

     [EnableCors("CORS")]
     [Route("PreuzmiCitaoceSaKnjigama/{KnjigaID}")]  
     [HttpGet]
     public async Task<ActionResult> PreuzmiCitaoceSaKnjigama(int KnjigaID)
        {
            try
            {
                var aktivnost = await Context.Knjige.Where(p => p.ID == KnjigaID).FirstAsync();
                if (aktivnost == null)
                    throw new Exception("Ne postoji knjiga sa tim ID-jem!");
                var ucenici = await Context.PozajmljenjeKnjige.Include(p => p.Knjiga).Where(a => a.Knjiga.ID == KnjigaID).Include(p => p.Citalac).Select(p => new
                {
                    ime = p.Citalac.Ime,
                    prezime = p.Citalac.Prezime,
                    brojTelefona = p.Citalac.BrojTelefona,
                    id = p.Citalac.ID,
                    imeRoditelja = p.Citalac.ImeRoditelja,
                    poslednjiDatumVracanja = p.DatumVracanja.ToShortDateString(),
                    trebaDaVrati = DateTime.Today.CompareTo(p.DatumVracanja.AddDays(14))
                }).ToListAsync();

                return Ok(ucenici);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }
        
        [EnableCors("CORS")]
        [HttpPut]
        [Route("VratiDatum/{CitalacID}/{KnjigaID}")]
        public async Task<ActionResult> VratiDatum(int CitalacID, int KnjigaID)
        {
            try
            {
                var pom = await Context.PozajmljenjeKnjige.Where(p => p.Knjiga.ID == KnjigaID && p.Citalac.ID == CitalacID).FirstOrDefaultAsync();
                if (pom == null)
                    throw new Exception("Greska, nema takve knjige ili citaoca!");
                pom.DatumVracanja = pom.DatumVracanja.AddDays(10);
                await Context.SaveChangesAsync();
                return Ok("Postavljen novi datum vracanja!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    
    }
}