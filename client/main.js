import { Biblioteka } from "./Biblioteka.js";
import { CitalacForma } from "./CitalacForma.js";
import { kreirajOpcijuZaSelekt } from "./funkcije.js";
import { removeAllChildNodes } from "./funkcije.js";
import { KnjigaForma } from "./KnjigaForma.js"

let listaBiblioteka = [];

ucitajBiblioteke();
kreirajStranicu();

function kreirajStranicu()
{
    let stranica = document.createElement("div");
    stranica.className = "stranica";
    document.body.appendChild(stranica);

    let gornjiBar = document.createElement("div");
    gornjiBar.className = "gornjiBar";
    stranica.appendChild(gornjiBar);

    let naslovDiv = document.createElement("div");
    naslovDiv.className = "divGBNaslov";

    let naslov = document.createElement("label");
    naslov.innerHTML = "Biblioteke";
    naslov.className = "lblNaslov";
    naslovDiv.appendChild(naslov);
    gornjiBar.appendChild(naslovDiv);

    let divSelectBiblioteke = document.createElement("div");
    divSelectBiblioteke.className = "divKontrola";
    gornjiBar.appendChild(divSelectBiblioteke);

    let divLblBiblioteke = document.createElement("div");
    divLblBiblioteke.className = "divKontrolaNaslov";
    let lblBiblioteke = document.createElement("label");
    lblBiblioteke.innerHTML = "Biblioteke "
    lblBiblioteke.className = "lblKontrolaNaslov";
    divLblBiblioteke.appendChild(lblBiblioteke);
    divSelectBiblioteke.appendChild(divLblBiblioteke);

    let selectBiblioteke = document.createElement("select");
    selectBiblioteke.className = "selKontrolaBiblioteka";
    divSelectBiblioteke.appendChild(selectBiblioteke);

    let navigacija = document.createElement("div");
    navigacija.className = "navigacija";
    gornjiBar.appendChild(navigacija);
    kreairajNavigaciju(navigacija);

    let sredina = document.createElement("div");
    sredina.className = "sredina";
    stranica.appendChild(sredina);

    let sadrzaj = document.createElement("div");
    sadrzaj.className = "sadrzaj";
    sadrzaj.id = "sadrzaj";
    sredina.appendChild(sadrzaj);
    let donjiBar = document.createElement("div");
    donjiBar.className = "donjiBar";
    stranica.appendChild(donjiBar);

    let lblDB = document.createElement("label");
    lblDB.innerHTML = "@Biblioteke";
    donjiBar.appendChild(lblDB);

}

function prikazZaCitaoce() {
    let sadrzaj = document.querySelector(".sadrzaj");
    removeAllChildNodes(sadrzaj);

    let citalacForma = new CitalacForma();
    citalacForma.crtaj(sadrzaj);
}

function ucitajBiblioteke() {
    fetch("https://localhost:5001/Biblioteka/PreuzmiBiblioteke").then(s => {
        if (!s.ok) {
            window.alert("Nije moguce ucitati biblioteke!");
        } else {
            s.json().then(biblioteke => {
                biblioteke.forEach(biblioteka => {
                    let bibl = new Biblioteka(biblioteka.id, biblioteka.ime, biblioteka.adresa);
                    listaBiblioteka.push(bibl);

                });
                upisiBiblioteke();
                prikazZaKnjige();
            });
        }
    });
}

function upisiBiblioteke() {
    let slBiblioteke = document.querySelector(".selKontrolaBiblioteka");

    listaBiblioteka.forEach(bibl => {
        let biblioteka = document.createElement("option");
        biblioteka.innerHTML = bibl.Ime;
        biblioteka.value = bibl.ID;
        slBiblioteke.appendChild(biblioteka);
    })
}

function prikazZaKnjige() {
    let sadrzaj = document.querySelector(".sadrzaj");
    removeAllChildNodes(sadrzaj);

    let knjigaForma = new KnjigaForma();
    knjigaForma.crtaj(sadrzaj);
}

function kreairajNavigaciju(nav) {
    let selekcija = document.createElement("select");
    selekcija.className = "selKontrola";
    selekcija.id = "selectKontrolee"
    selekcija.appendChild(kreirajOpcijuZaSelekt("Knjige", 1));
    selekcija.appendChild(kreirajOpcijuZaSelekt("Citaoci", 2));

    selekcija.onchange = (e) => {
        switch (selekcija.selectedIndex) {
            case 0:
                prikazZaKnjige();
                break;
            default:
                prikazZaCitaoce();
                break;
        }
    };
    nav.appendChild(selekcija);
}