using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using System.Collections.Generic;

namespace Biblioteka.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class CitalacController : ControllerBase 
    {
        public BibliotekaContext Context { get; set; }
        public CitalacController(BibliotekaContext context)
        {
            Context = context;
        }

        [EnableCors("CORS")]
        [Route("DodajCitaoca/{Ime}/{ImeRoditelja}/{Prezime}/{BrojTelefona}")]
        [HttpPost]
        public async Task<ActionResult> DodajCitaoca(string Ime, string ImeRoditelja, string Prezime, string BrojTelefona)
        {
            if (string.IsNullOrWhiteSpace(Ime) || Ime.Length > 30)
                return BadRequest($"Parametar 'Ime citaoca' : {Ime} nije moguc!");

            if (string.IsNullOrWhiteSpace(ImeRoditelja) || ImeRoditelja.Length > 30)
                return BadRequest($"Parametar 'Ime Roditelja' : {ImeRoditelja} nije validan argument!");

            if (string.IsNullOrWhiteSpace(Prezime) || Prezime.Length > 30)
                return BadRequest($"Parametar 'Prezime citaoca' : {Prezime} nije moguc!");

            if (string.IsNullOrWhiteSpace(BrojTelefona) || BrojTelefona.Length > 14)
                return BadRequest($"Parametar 'Broj telefona' : {BrojTelefona} nije validan argument!");

            bool Cifra = true;
            char[] charList = BrojTelefona.ToCharArray();
            int i = 0;
            while (i < charList.Count() && Cifra)
            {
                if (charList[i] < '0' || charList[i] > '9')
                    Cifra = false;
                i++;
            }
            if(!Cifra)
               return BadRequest($"Parametar 'Broj telefona' : {BrojTelefona} je nevalidan argument!");

            try
            {
                Citalac citalac = new Citalac();
                citalac.Ime = Ime;
                citalac.ImeRoditelja = ImeRoditelja;
                citalac.Prezime = Prezime;
                citalac.BrojTelefona = BrojTelefona;

                Context.Citaoci.Add(citalac);
                await Context.SaveChangesAsync();

                return Ok($"Dodat je citalac : {citalac.Ime} {citalac.ImeRoditelja} {citalac.Prezime} {citalac.BrojTelefona}");
            
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [EnableCors("CORS")]
        [Route("Obrisicitaoca/{CitalacID}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiCitaoca(int CitalacID)
        {
            try
            {
                var citalac = await Context.Citaoci.Where(p => p.ID == CitalacID).FirstAsync();
                if(citalac == null)
                   throw new Exception("Ne postoji citalac sa unetim ID-jem");
                var ListaPozajmljuje = await Context.PozajmljenjeKnjige.Where(p => p.Citalac.ID == CitalacID).ToListAsync();
                
                foreach ( var pozajmica in ListaPozajmljuje)
                {
                    Context.Remove(pozajmica);
                }
                Context.Remove(citalac);
                await Context.SaveChangesAsync();
                return Ok($"Obrisan je citalac sa ID-jem {CitalacID}!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        
        }

    
        [EnableCors("CORS")]
        [Route("PreuzmiCitaoce")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiCitaoce(int BibliotekaID)
       { 
         try
         {
             var biblioteka = await Context.Biblioteke.Where( p =>p.ID==BibliotekaID).FirstAsync();
             if(biblioteka == null)
             throw new Exception("Biblioteka ne postoji!");
            var citaoci = await Context.Citaoci.Include(p => p.ListaKnjiga).Where(p => p.ListaKnjiga.Any(akt => akt.Biblioteka.ID == BibliotekaID) || p.ListaKnjiga.Count() == 0).Select(
                    p => new
                    {
                        p.ID,
                        p.Ime,
                        p.ImeRoditelja,
                        p.Prezime,
                        p.BrojTelefona,
                        brojKnjiga = p.ListaKnjiga.Count()
                    }
                ).ToListAsync();
                return Ok(citaoci);
         }
         
         catch (Exception e)
         {
           return BadRequest(e.Message);
         }
        }



    } 
}


