let form=document.querySelector("#form");

let valider=document.querySelector(".valider");
let entrer=document.querySelector(".enter");
let rec=localStorage.getItem(1)
console.log(rec);

valider.addEventListener('click',()=>{
    const verify=entrer.value;
    if(((verify) && (verify==="Ghis Group"))||(rec==='Ghis Group')){
        localStorage.setItem(1,verify)
        alert("Authentification réussie");

        setTimeout(()=>{
            window.location.href='tableau.html'
        },3000);

    } 

    else{
        alert("Veuillez entrer un mot de passe valide");
        //entrer.textContent=""
        //form.reset();
        entrer.value="";
    }
});

valider.addEventListener('mouseover',()=>{
    valider.style.backgroundColor="blue";
    valider.style.color="white";
});

valider.addEventListener('mouseout',()=>{
    valider.style.backgroundColor="white";
    valider.style.color="black";
});

entrer.addEventListener('keydown',(event)=>{
    if(event.key==="Enter"){
        const verify=entrer.value;
        if(((verify) && (verify==="Ghis Group"))||(rec==='Ghis Group')){
            alert("Authentification réussie");
            event.preventDefault(); // CRUCIAL : Bloque le rechargement de la page !
            setTimeout(()=>{
                window.location.href='tableau.html'
            },3000);
        }   
        else{
            alert("Veuillez entrer un mot de passe valide");
            entrer.value="";
        }
    }
});


// 1. Bloquer le clic droit
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 2. Bloquer les raccourcis clavier (Ctrl+U, F12, Ctrl+Maj+I, etc.)
document.addEventListener('keydown', (e) => {
    
    // Bloquer F12
    if (e.key === "F12") {
        e.preventDefault();
    }

    // Bloquer Ctrl + U
    if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
    }

    // Bloquer Ctrl + Shift + I (Inspecteur) et Ctrl + Shift + J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) {
        e.preventDefault();
    }

    // Bloquer Ctrl + S (Sauvegarder la page)
    if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
    }
});
