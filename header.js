document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            // Alterne l'affichage de la liste déroulante par-dessus le site
            menuToggle.classList.toggle("open");
            mainNav.classList.toggle("open");
        });

        // Ferme automatiquement le menu déroulant si l'utilisateur clique en dehors
        document.addEventListener("click", (event) => {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                menuToggle.classList.remove("open");
                mainNav.classList.remove("open");
            }
        });
    }
});
console.log(innerWidth);