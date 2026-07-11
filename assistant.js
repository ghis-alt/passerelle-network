   document.addEventListener("DOMContentLoaded", () => {
   // ==========================================
    // 2. ASSISTANT VIRTUEL (ACCUEIL SEULEMENT)
    // ==========================================
    const assistantContainer = document.getElementById("assistant-container");
    const assistantTrigger = document.getElementById("assistant-trigger");
    const chatBody = document.getElementById("chatBody");
    const actionsPanel = document.getElementById("actionsPanel");

    if (assistantContainer && assistantTrigger) {
        assistantTrigger.addEventListener("click", () => {
            assistantContainer.classList.toggle("active");
            if(chatBody.children.length === 0) {
                sendBotMessage("Bienvenue chez Groupe la Passerelle Network. Prêt à propulser votre infrastructure informatique ou à donner vie à vos projets logiciels ?");
                setTimeout(() => {
                    sendBotMessage("Comment puis-je vous guider ?");
                    displayBotOptions();
                }, 1000);
            }
        });
    }

    function sendBotMessage(text) {
        const msg = document.createElement("div");
        msg.className = "msg bot";
        msg.textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function displayBotOptions() {
        actionsPanel.innerHTML = "";
        const options = [
            { text: "🚀 Demander un devis", action: "devis" },
            { text: "☎️ Nous contacter", action: "devis" },
            { text: "🛒 Parcourir le catalogue matériel", action: "catalogue" },
            { text: "📢 Découvrir nos services", action: "service" },
            { text: "👋 Ignorer l'assistant", action: "ignore", isIgnore: true }
        ];

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = opt.isIgnore ? "chat-btn btn-ignore" : "chat-btn";
            btn.textContent = opt.text;
            btn.addEventListener("click", () => handleBotAction(opt.action));
            actionsPanel.appendChild(btn);
        });
    }

    function handleBotAction(action) {
        if (action === "ignore") {
            sendBotMessage("Très bien. Je reste disponible juste ici si vous changez d'avis !");
            setTimeout(() => {
                // Ferme la fenêtre mais laisse le bouton d'appel intact en bas
                assistantContainer.classList.remove("active");
            }, 1200);
        } else if (action === "devis") {
            assistantContainer.classList.remove("active");
            window.location.href = "contact.html";
        } else if (action === "catalogue") {
            window.location.href = "catalogue.html";
        } else if (action==="service") {
            window.location.href='services.html'
        }
    }
   }
)

