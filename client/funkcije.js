export function kreirajDivButton(btnClass, btnText, divClass, func)
{
    let divBtn = document.createElement("div");
    divBtn.className = divClass;

    let btn = document.createElement("button");
    btn.innerHTML = btnText;
    btn.className = btnClass;
    btn.onclick = func;
    divBtn.appendChild(btn);
    return divBtn;
}
export function kreirajDivTextITextBox(lblText, lblClass, tbxClass, tbxType, tbxID, divClass)
{
    let lbl = document.createElement("label");
    lbl.className = lblClass;
    lbl.innerHTML = lblText;

    let tbx = document.createElement("input");
    tbx.type = tbxType;
    tbx.className = tbxClass;
    tbx.id = tbxID;

    let div = document.createElement("div");
    div.className = divClass;
    div.appendChild(lbl);
    div.appendChild(tbx);
    return div;
}
export function removeAllChildNodes(parent) 
{
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

export function kreirajDiviLabel(divClass, lblText, lblClass)
{
    let div = document.createElement("div");
    div.className = divClass;
    let lbl = document.createElement("label");
    lbl.innerHTML = lblText;
    lbl.className = lblClass;
    div.appendChild(lbl);
    return div; 
}
export function kreirajDivDvaDugmeta(divClass, btnClass1, btnText1, btnFunc1, btnClass2, btnText2, btnFunc2) {
    let div = document.createElement("div");

    div.className = divClass;

    let btn1 = document.createElement("button");
    btn1.className = btnClass1;
    btn1.innerHTML = btnText1;
    btn1.onclick = btnFunc1;
    div.appendChild(btn1);

    let btn2 = document.createElement("button");
    btn2.className = btnClass2;
    btn2.innerHTML = btnText2;
    btn2.onclick = btnFunc2;
    div.appendChild(btn2);

    return div;
}

export function kreirajOpcijuZaSelekt(optionText, optionValue) {
    let op = document.createElement("option");
    op.value = optionValue;
    op.innerHTML = optionText;
    return op;
}

