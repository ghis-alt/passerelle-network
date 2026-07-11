document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('interactiveContactForm');
    const successModal = document.getElementById('contactSuccessModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const subjectInput = document.getElementById('messageSubject');
    const messageInput = document.getElementById('clientMessage');
    
    // Variables du CAPTCHA local
    const captchaLabel = document.getElementById('captchaQuestion');
    const captchaInput = document.getElementById('captchaInput');
    let number1 = Math.floor(Math.random() * 9) + 2;
    let number2 = Math.floor(Math.random() * 8) + 2;
    let correctCaptchaAnswer = number1 + number2;

    // Affichage du calcul anti-robot
    if (captchaLabel) {
        captchaLabel.textContent = `${number1} + ${number2}`;
    }

    // Gestion du produit pré-rempli depuis le catalogue
    const targetProduct = localStorage.getItem('nomProduitCible');
    if (targetProduct && subjectInput && messageInput) {
        subjectInput.value = `Demande d'informations : ${targetProduct}`;
        messageInput.value = `Bonjour, je suis intéressé par le produit "${targetProduct}" vu sur votre catalogue. Merci de me recontacter pour me fournir les spécifications complètes et un devis personnalisé pour notre structure.\n\nCordialement,`;
        localStorage.removeItem('nomProduitCible');
    }

    // Interception de la soumission du formulaire
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. CONTRÔLE SÉCURITÉ DU CAPTCHA
            if (parseInt(captchaInput.value) !== correctCaptchaAnswer) {
                alert("Sécurité : Le calcul est incorrect. Prouvez que vous n'êtes pas un robot.");
                return;
            }

            // 2. EXTRACTION ET CONSTRUCTION DU PAQUET API (JSON)
            const messagePayload = {
                id: Date.now(),
                dateEnvoi: new Date().toLocaleString('fr-FR'),
                nom: document.getElementById('clientName').value,
                entreprise: document.getElementById('clientCompany').value || "Non spécifiée",
                email: document.getElementById('clientEmail').value,
                telephone: document.getElementById('clientPhone').value,
                objet: subjectInput.value,
                message: messageInput.value,
                captchaVerified: true
            };

            // 3. ENVOI DU JSON VERS LE STORAGE PARTAGÉ (Accessible par le dossier admin)
            let localBdd = JSON.parse(localStorage.getItem('messagesDatabase')) || [];
            localBdd.push(messagePayload);
            localStorage.setItem('messagesDatabase', JSON.stringify(localBdd));

            // 4. AFFICHAGE DU POP-UP DE SUCCÈS (Le formulaire reste intact et visible dessous)
            if (successModal) {
                successModal.classList.remove('hidden');
            }
            
            // Réinitialisation des champs du formulaire
            contactForm.reset();

            // Régénérer un nouveau calcul pour le prochain envoi éventuel
            number1 = Math.floor(Math.random() * 9) + 2;
            number2 = Math.floor(Math.random() * 8) + 2;
            correctCaptchaAnswer = number1 + number2;
            captchaLabel.textContent = `${number1} + ${number2}`;
        });
    }

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.add('hidden');
        });
    }
});