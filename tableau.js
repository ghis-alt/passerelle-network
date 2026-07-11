document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tableMessagesBody');
    const targetDisplay = document.getElementById('targetClientDisplay');
    const responseTextarea = document.getElementById('adminResponseTextarea');
    
    // Récupération des deux nouveaux boutons
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const sendSmsBtn = document.getElementById('sendSmsBtn');

    let selectedClient = null;

    // 1. CHARGEMENT ET AFFICHAGE DU TABLEAU
    function renderTable() {
        const messages = JSON.parse(localStorage.getItem('messagesDatabase')) || [];
        tableBody.innerHTML = "";

        if (messages.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Aucun message reçu dans la base JSON.</td></tr>`;
            return;
        }

        messages.forEach(msg => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${msg.dateEnvoi}</td>
                <td><strong>${msg.nom}</strong></td>
                <td><em>${msg.entreprise || "Non spécifiée"}</em></td>
                <td>${msg.email}</td>
                <td>${msg.telephone}</td>
                <td>${msg.objet}</td>
                <td>
                    <button class="btn-select" data-id="${msg.id}" style="margin-right: 5px;">Sélectionner</button>
                    <button class="btn-delete" data-id="${msg.id}" style="background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">Supprimer</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Action : Sélectionner
        document.querySelectorAll('.btn-select').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const currentMsg = messages.find(m => m.id == id);
                triggerClientSelection(currentMsg);
            });
        });

        // Action : Supprimer
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
                    deleteMessage(id);
                }
            });
        });
    }

    function deleteMessage(id) {
        let messages = JSON.parse(localStorage.getItem('messagesDatabase')) || [];
        messages = messages.filter(m => m.id != id);
        localStorage.setItem('messagesDatabase', JSON.stringify(messages));
        
        if (selectedClient && selectedClient.id == id) {
            cancelSelection();
        }
        renderTable();
    }

    // 2. SÉLECTION ET ACTIVATION DES BOUTONS
    function triggerClientSelection(clientMsg) {
        if (!clientMsg) return;
        selectedClient = clientMsg;
        
        targetDisplay.textContent = `${clientMsg.nom} [Société: ${clientMsg.entreprise}] (${clientMsg.email} | ${clientMsg.telephone})`;
        
        responseTextarea.disabled = false;
        
        // Activation visuelle des deux boutons
        [sendEmailBtn, sendSmsBtn].forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        });

        responseTextarea.value = `Cher client ${clientMsg.nom},\n\nLe Groupe la Passerelle Network a bien reçu votre message concernant "${clientMsg.objet}". Notre équipe technique valide la bonne réception de votre demande.\n\nCordialement,\nService Client - Passerelle Network.`;
    }

    function cancelSelection() {
        responseTextarea.value = "";
        responseTextarea.disabled = true;
        targetDisplay.textContent = "Aucun (Sélectionnez une ligne)";
        
        // Désactivation des deux boutons
        [sendEmailBtn, sendSmsBtn].forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
        });
        selectedClient = null;
    }

    // 3. ACTION ENVOI E-MAIL
    sendEmailBtn.addEventListener('click', () => {
        if (!selectedClient) return;
        const messageFinal = responseTextarea.value;
        const texteEncode = encodeURIComponent(messageFinal);
        
        // Utilisation de window.open pour forcer l'application par défaut sans casser la page courante
        window.open(`mailto:${selectedClient.email}?subject=Validation de réception - Passerelle Network&body=${texteEncode}`, '_self');
        cancelSelection();
    });

    // 4. ACTION ENVOI SMS
    sendSmsBtn.addEventListener('click', () => {
        if (!selectedClient) return;
        const messageFinal = responseTextarea.value;
        const texteEncode = encodeURIComponent(messageFinal);
        
        // Déclenche l'application SMS par défaut de l'ordinateur
        window.open(`sms:${selectedClient.telephone}?body=${texteEncode}`, '_self');
        cancelSelection();
    });

    renderTable();
});