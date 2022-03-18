import { kreirajDivTextITextBox } from "./funkcije.js";
import { kreirajDivButton } from "./funkcije.js";
import { removeAllChildNodes } from "./funkcije.js";
import { kreirajDiviLabel } from "./funkcije.js";

export class CitalacForma 
{
    constructor()
    {
        this.listaCitalaca = new Array();
        this.listaKnjiga = new Array();
        this.host = null;
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
                    this.listaKnjiga.push(knjiga);
    
                });
                this.updateListuKnjiga();
            }
        });
    });

}

updateListuKnjiga() 
{
    let selectKnjiga = this.host.querySelector(".selKontrolaBiblioteka");
    removeAllChildNodes(selectKnjiga);
    let knjiga;
    this.listaKnjiga.forEach(knj => {
        knjiga = document.createElement("option");
        knjiga.innerHTML = knj.naslov;
        knjiga.value = knj.id;
        selectKnjiga.appendChild(knjiga);
    });
}

  pribaviCitaoceBezKnjiga()
{       
        fetch("https://localhost:5001/Pozajmljuje/VratiCitaoceBezKnjiga/").then(p => {
            p.json().then(citaoci => {
                if (!p.ok) {
                    window.alert("Nije moguce pribaviti citaoce!");
                } else {
                    while(this.listaCitalaca.length > 0) this.listaCitalaca.pop();
                    citaoci.forEach(citalac => {
                        this.listaCitalaca.push(citalac);
                    });
                    this.updateTabeluCitalaca();
                }
            });
        });
    }
   izbrisiCitaoca()
    {
        if (confirm("Da li zelis da izbrises citaoca?")) {
            let red = document.querySelector(".selektovanRed");
            if (red != null) {
                let CitalacID = red.value;
                fetch("https://localhost:5001/Citalac/ObrisiCitaoca/" + CitalacID, { method: "DELETE" }).then(p => {
                    this.pribaviCitaoceBezKnjiga();
                    if (!p.ok) {
                        window.alert("Nije moguce obrisati citaoca!");
                    }
                });
            } else {
                window.alert("Selektuj Citaoca!");
            }
        }
    }

dodajCitaoca()
{
    let Ime = document.querySelector(".tbxKontrolaIme").value;
    let ImeRoditelja = document.querySelector(".tbxKontrolaImeRoditelja").value;
    let Prezime = document.querySelector(".tbxKontrolaPrezime").value;
    let BrojTelefona = document.querySelector(".tbxKontrolaBroj").value;

    document.querySelector(".tbxKontrolaIme").value = "";
    document.querySelector(".tbxKontrolaImeRoditelja").value = "";
    document.querySelector(".tbxKontrolaPrezime").value = "";
    document.querySelector(".tbxKontrolaBroj").value = "";

    fetch("https://localhost:5001/Citalac/DodajCitaoca/" + Ime + "/" + ImeRoditelja + "/" + Prezime + "/" + BrojTelefona, {method: "POST"}).then(p =>
    {
        this.pribaviCitaoceBezKnjiga();
       if(!p.ok)
       {
           window.alert("Nije moguce dodati citaoca!");
       } 
    });
}

pozajmiKnjiguCitaocu(KnjigaID) 
{
    let red = document.querySelector(".selektovanRed");
    if (red != null) {
        let CitalacID = red.value;
        fetch("https://localhost:5001/Pozajmljuje/UclaniCitaoca/" + CitalacID + "/" + KnjigaID, { method: "POST" }).then(p => {
            this.pribaviCitaoce(KnjigaID);
            if (!p.ok) {
                window.alert("Nije moguce pozajmiti knjigu citaocu!");
            }
        });
    } else {
        window.alert("Selektuj Citaoca!");
    }
}

pribaviCitaoce(idKnjige)
{
    fetch("https://localhost:5001/Pozajmljuje/PreuzmiCitaoceSaKnjigama/" + idKnjige, { method : "GET"}).then(p => {
        p.json().then(citaoci => {
            if (!p.ok) {
                window.alert("Nije moguce pribaviti citaoce!");
            } else {
                while(this.listaCitalaca.length > 0) this.listaCitalaca.pop();
                citaoci.forEach(citalac => {
                    this.listaCitalaca.push(citalac);
                });
                this.updateTabeluCitalaca();
            }
        });
    });

}

updateTabeluCitalaca() 
{
    let tabelaCitalaca = this.host.querySelector(".tabela");
    removeAllChildNodes(tabelaCitalaca);

   //obrisano je zaglavlje pa ga dodajemo
    this.dodajZaglavljaTabeli(tabelaCitalaca);

    this.listaCitalaca.forEach((citalac) => {
        var red = document.createElement("tr");
        red.className = "redUTabeli";

        red.value = citalac.id;

        //Za selekciju, da vidmo ko je red selektovan
        red.addEventListener("click", () => {
            tabelaCitalaca.childNodes.forEach(p => {
                if (p.className != "zaglavlje") {
                    p.className = "redUTabeli";
                    p.id = "";
                }
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

    });
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

}

crtajTabelu(host)
{

    let tabela = document.createElement("table");
    tabela.className = "tabela";
    tabela.id = "tabela"
    host.appendChild(tabela);

    this.dodajZaglavljaTabeli(tabela);
}

crtajKontrolu(host)
 {
    //selekcija knjiga za pozajmljivanje
    let divKnjiga = document.createElement("div");
    divKnjiga.className = "divKontrola";
    host.appendChild(divKnjiga);

    let lblKnjiga = document.createElement("label");
    lblKnjiga.className = "lblKontrola";
    lblKnjiga.innerHTML = "Knjiga";
    divKnjiga.appendChild(lblKnjiga);

    let selKnjiga = document.createElement("select");
    selKnjiga.className = "selKontrolaBiblioteka";
    selKnjiga.id = "selKnjiga";
    divKnjiga.appendChild(selKnjiga);
  
    host.appendChild(kreirajDivButton("btnKontrola", "Iznajmi", "divKontrola", (ev) => { this.pozajmiKnjiguCitaocu(selKnjiga.options[selKnjiga.selectedIndex].value); }));

    host.appendChild(kreirajDivButton("btnKontrola", "Prikaži citaoce bez iznajmljenih knjiga", "divKontrola", (ev) => { this.pribaviCitaoceBezKnjiga(); }));
    
    host.appendChild(kreirajDivButton("btnKontrola", "Prikaži citaoce sa iznajmljenim knjigama", "divKontrola", (ev) => { this.pribaviCitaoce(selKnjiga.options[selKnjiga.selectedIndex].value); }));

    host.appendChild(kreirajDivButton("btnKontrola", "Obriši clana", "divKontrola", (ev) => { this.izbrisiCitaoca(); }));

}

crtaj(host)
{
    
    this.host = host;

    let divTabela = document.createElement("div");
    divTabela.className = "divTabela";
    host.appendChild(divTabela);
    this.crtajTabelu(divTabela);

    let divDodaj = document.createElement("div");
    divDodaj.className = "kontrola";
    host.appendChild(divDodaj);
    this.crtajDivDodaj(divDodaj);

    let divKontrola = document.createElement("div");
    divKontrola.className = "kontrola";
    host.appendChild(divKontrola);
    this.crtajKontrolu(divKontrola);

    this.pribaviKnjigu();
    this.pribaviCitaoceBezKnjiga();

}

crtajDivDodaj(host) 
{
    host.appendChild(kreirajDiviLabel("divKontrolaNaslov", "Dodaj novog clana", "lblKontrola lblKontrolaNaslov"));
    host.appendChild(kreirajDivTextITextBox("Ime", "lblKontrola", "tbxKontrolaIme", "text", "tbxImeKontrola", "divKontrola"));
    host.appendChild(kreirajDivTextITextBox("Ime Roditelja", "lblKontrolaImeRoditelja", "tbxKontrolaImeRoditelja", "text", "tbxImeRoditeljaKontrola", "divKontrola"));
    host.appendChild(kreirajDivTextITextBox("Prezime", "lblKontrolaPrezime", "tbxKontrolaPrezime", "text", "tbxPrezimeKontrola", "divKontrola"));
    host.appendChild(kreirajDivTextITextBox("Broj Telefona", "lblKontrolaBroj", "tbxKontrolaBroj", "text", "tbxBrojKontrola", "divKontrola"));

    let divBtnDodaj = document.createElement("div");
    divBtnDodaj.className = "divKontrola";
    let btnDodaj = document.createElement("button");
    btnDodaj.className = "btnKontrola";
    btnDodaj.innerHTML = "Dodaj clana";
    btnDodaj.onclick = (ev) => { this.dodajCitaoca(); }
    divBtnDodaj.appendChild(btnDodaj);
    host.appendChild(divBtnDodaj);

}

}