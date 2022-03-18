import { Knjiga } from "./Knjiga.js";
import { kreirajDiviLabel, kreirajDivTextITextBox } from "./funkcije.js";
import { removeAllChildNodes } from "./funkcije.js";
import { kreirajDivDvaDugmeta } from "./funkcije.js";

export class KnjigaForma
{
    constructor()
    {
        this.listaKnjiga = [];
        this.listaCitaoca = [];
        this.host = null;
    }

    izbrisiKnjige(KnjigaID)
    {
        if(confirm("Da li zaista zelite da obrisete knjigu iz biblioteke?"))
        {
            fetch("https://localhost:5001/Knjiga/Obrisiknjigu/" + KnjigaID, { method: "DELETE" }).then(p => {
                if (!p.ok) {
                    window.alert("Nije moguce obrisati knjigu!");
                }
                this.pribaviKnjigu();
                this.updateListuCitalaca();
            }); 
        }
    }


dodajKnjigu()
{
    let slBiblioteke = document.querySelector(".selKontrolaBiblioteka");
    let BibliotekaID = slBiblioteke.options[slBiblioteke.selectedIndex].value;

    let Naslov = document.querySelector(".tbxKontrola");
    let ImePisca = document.querySelector(".tbxKontrola1");
    let Tip = document.querySelector(".tbxKontrola2");

    fetch("https://localhost:5001/Knjiga/Dodajknjigu/" + Naslov.value + "/" + ImePisca.value + "/" + Tip.value + "/" + BibliotekaID, { method: "POST" }).then(p => {
        if (!p.ok) {
            console.log(p);
            window.alert("Nije moguce dodati knjigu!");
        }
        this.pribaviKnjigu();
        Naslov.value = "";
        ImePisca.value = "";
        Tip.value = "";
    });

}

pribaviKnjigu() 
{
    let slBiblioteke = document.querySelector(".selKontrolaBiblioteka");
    let bibliotekaID = slBiblioteke.options[slBiblioteke.selectedIndex].value;
    this.listaKnjiga.length = 0;

    fetch("https://localhost:5001/Knjiga/PreuzmiKnjige/" + bibliotekaID).then(p => {
        p.json().then(knjige => {
            if (!p.ok) {
                window.alert("Nije moguce privaviti knjige!");
            } else {
                knjige.forEach(knjiga => {
                    this.listaKnjiga.push(new Knjiga(knjiga.id, knjiga.naslov, knjiga.imePisca, knjiga.tip));
    
                });
                this.updateListuKnjiga();
            }
        });
    });

}

updateListuKnjiga() 
{
    let selectKnjiga = this.host.querySelector(".selKontrola");
    removeAllChildNodes(selectKnjiga);
    let knjiga;
    this.listaKnjiga.forEach(knj => {
        knjiga = document.createElement("option");
        knjiga.innerHTML = knj.Naslov;
        knjiga.value = knj.ID;
        selectKnjiga.appendChild(knjiga);
    });
    this.nadjiCitaoceSaKnjigama(selectKnjiga.options[selectKnjiga.selectedIndex].value);
}

nadjiCitaoceSaKnjigama(idKnjige)
{
    fetch("https://localhost:5001/Pozajmljuje/PreuzmiCitaoceSaKnjigama/" + idKnjige).then(p => {
        p.json().then(citaoci => {
            if (!p.ok) {
                window.alert("Nije moguce pribaviti citaoce!");
            } else {
                while(this.listaCitaoca.length > 0) this.listaCitaoca.pop();
                citaoci.forEach(citalac => {
                   // console.log(citalac);
                    this.listaCitaoca.push(citalac);
                });
                this.updateListuCitalaca();
            }
        });
    });

}

promeniDatumPozajmljivanja(knjigaID) {
    let citalacID = document.querySelector(".selektovanRed");
    if (citalacID != null) {
        fetch("https://localhost:5001/Pozajmljuje/VratiDatum/" + citalacID.value + "/" + knjigaID, { method: 'PUT' })
            .then(p => {
                if (!p.ok) {
                    window.alert("Nije moguce promeniti datum poslednjeg pozajmljivanja!");
                }
                this.nadjiCitaoceSaKnjigama(knjigaID);
            });
    } else {
        window.alert("Selektuj citaoca prvo!");
    }
}

updateListuCitalaca() 
{
    let tabelaCitalaca = document.querySelector(".tabela");
    removeAllChildNodes(tabelaCitalaca);

    //Brise se sve iza tabele, cak i zaglavlja pa moramo da ponovo dodamo
    this.dodajZaglavljaTabeli(tabelaCitalaca);

    this.listaCitaoca.forEach((citalac) => {
        var red = document.createElement("tr");
        red.className = "redUTabeli";
        red.value = citalac.id;

        //Za selekciju, da vidmo ko je red selektovan
        red.addEventListener("click", () => {
            tabelaCitalaca.childNodes.forEach(p => {
                if (p.className != "zaglavlje")
                    p.className = "redUTabeli";
            });
            red.classList += " selektovanRed";
            red.id = "selektovanRed";
        });

        tabelaCitalaca.appendChild(red);

        let ime = document.createElement("td");
        ime.innerHTML = citalac.ime;
        red.appendChild(ime);

        let irod = document.createElement("td");
        irod.innerHTML = citalac.imeRoditelja;
        red.appendChild(irod);

        let prezime = document.createElement("td");
        prezime.innerHTML = citalac.prezime;
        red.appendChild(prezime);

        let br = document.createElement("td");
        br.innerHTML = citalac.brojTelefona;
        red.appendChild(br);

        let dtp = document.createElement("td");
        dtp.innerHTML = citalac.poslednjiDatumVracanja;
        red.appendChild(dtp);

    });
}

dodajKontrolu(kontrola) 
{
    let knjigaSelectDiv = document.createElement("div");
    knjigaSelectDiv.classList += "divKontrola";
    kontrola.appendChild(knjigaSelectDiv);

    let lblKnjiga = document.createElement("label");
    lblKnjiga.innerHTML = "Knjiga";
    lblKnjiga.classList += "lblKontrola";
    knjigaSelectDiv.appendChild(lblKnjiga);


    let selectKnjige = document.createElement("select");
    selectKnjige.className += "selKontrola";
    selectKnjige.id = "selectKnjige"
    selectKnjige.onchange = (ev) => {
        let knjigaID = selectKnjige.options[selectKnjige.selectedIndex].value;
        this.nadjiCitaoceSaKnjigama(knjigaID);
    }
    knjigaSelectDiv.appendChild(selectKnjige);

}

dodajZaglavljaTabeli(tabela) 
{
    //Napravi zaglavlje

    let red = document.createElement("tr");
    red.className = "zaglavlje"
    tabela.appendChild(red);

    //Ime

    let el = document.createElement("th");
    el.innerHTML = "Ime"
    red.appendChild(el);

    //Ime roditelja

    el = document.createElement("th");
    el.innerHTML = "Ime Roditelja"
    red.appendChild(el);

    //Prezime

    el = document.createElement("th");
    el.innerHTML = "Prezime"
    red.appendChild(el);

    //Broj telefona 

    el = document.createElement("th");
    el.innerHTML = "Broj Telefona";
    red.appendChild(el);

    //Datum posljednjeg pozajmljivanja

    el = document.createElement("th");
    el.innerHTML = "Datum poslednjeg pozajmljivanja"
    red.appendChild(el);

}

dodajTabelu(divTabela)
 {
    let tabela = document.createElement("table");

    tabela.className = "tabela";
    tabela.id = "tabela";
    divTabela.appendChild(tabela);

    this.dodajZaglavljaTabeli(tabela);

}

crtaj(host)
    {
    this.host = host;

    let divTabela = document.createElement("div");
    divTabela.classList += "divTabela";
    host.appendChild(divTabela);
    this.dodajTabelu(divTabela);

    let kontrola = document.createElement("div");
    kontrola.classList += "kontrola";
    host.appendChild(kontrola);
    this.dodajKontrolu(kontrola);

    let divDodaj = document.createElement("div");
    divDodaj.className = "kontrola";
    host.appendChild(divDodaj);
    this.crtajDivDodaj(divDodaj);
    this.crtajDivCitalac(divDodaj);

    this.pribaviKnjigu();
    }

    crtajDivDodaj(host) 
{
    host.appendChild(kreirajDiviLabel("divKontrolaNaslov", "Dodaj novu knjigu", "lblKontrola lblKontrolaNaslov"));
    host.appendChild(kreirajDivTextITextBox("Naslov", "lblKontrola", "tbxKontrola", "text", "tbxNaslovKontrola", "divKontrola"));
    host.appendChild(kreirajDivTextITextBox("Ime Pisca", "lblKontrola", "tbxKontrola1", "text", "tbxImePiscaKontrola", "divKontrola"));
    host.appendChild(kreirajDivTextITextBox("Tip", "lblKontrola", "tbxKontrola2", "text", "tbxTipKontrola", "divKontrola"));
    
    let divBtnDodaj = document.createElement("div");
    divBtnDodaj.className = "divKontrola";
    let btnDodaj = document.createElement("button");
    btnDodaj.className = "btnKontrola";
    btnDodaj.innerHTML = "Dodaj knjigu";
    btnDodaj.onclick = (ev) => { this.dodajKnjigu(); }
    divBtnDodaj.appendChild(btnDodaj);
    host.appendChild(divBtnDodaj);

}

crtajDivCitalac(host)
{
    host.appendChild(kreirajDivDvaDugmeta("divKontrola", "btnKontrola", "Produzi datum", (ev) => { this.promeniDatumPozajmljivanja(selectKnjige.options[selectKnjige.selectedIndex].value); }, "btnKontrola", "Izbrisi knjigu",(ev) => {this.izbrisiKnjige(selectKnjige.options[selectKnjige.selectedIndex].value)}));
}
}


