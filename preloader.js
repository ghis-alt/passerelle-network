window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    const assistant = document.getElementById("assistant-container");

    if (preloader) {
        setTimeout(() => {
            // Fait disparaître le chargement
            preloader.classList.add("fade-out");
            
            // Fait apparaître l'assistant
            if (assistant) {
                assistant.classList.remove("assistant-hidden");
            }
        }, 1000); // Attend 1 seconde après le chargement total
    }
});