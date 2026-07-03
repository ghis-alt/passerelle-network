// BASE DE DONNÉES BRUTE (10 PRODUITS D'AMORÇAGE CONFORME AU CAHIER DES CHARGES)
const productsDatabase = [
    { id: 1, title: "Routeur Cisco ISR 4331", category: "reseaux", brand: "cisco", priceXAF: 2450000, stock: true, img: "cisco_router.png", desc: "Routeur de services intégrés pour liaisons spécialisées d'entreprises." },
    { id: 2, title: "Commutateur Cisco Catalyst 2960", category: "reseaux", brand: "cisco", priceXAF: 1150000, stock: true, img: "cisco_switch.png", desc: "Switch managé 24 ports Gigabit pour infrastructures LAN robustes." },
    { id: 3, title: "PC Portable Dell Latitude 5440", category: "materiel", brand: "dell", priceXAF: 190000, stock: true, img: "dell_laptop.png", desc: "Ordinateur professionnel Intel Core i5, 16GB RAM, 512GB SSD." },
    { id: 4, title: "Serveur Rack HP ProLiant DL360", category: "materiel", brand: "hp", priceXAF: 4800000, stock: false, img: "hp_server.png", desc: "Performances de calcul denses pour centres de données et virtualisation." },
    { id: 5, title: "iPhone 15 Pro Max 256GB", category: "accessoires", brand: "apple", priceXAF: 120000, stock: true, img: "iphone.png", desc: "Smartphone iOS haut de gamme avec châssis en titane et optique pro." },
    { id: 6, title: "PC Portable Acer Aspire 5", category: "materiel", brand: "acer", priceXAF: 205000, stock: true, img: "acer_laptop.png", desc: "Ordinateur polyvalent idéal pour la bureautique et les formations." },
    { id: 7, title: "Baie de Brassage Réseau 22U", category: "reseaux", brand: "dell", priceXAF: 650000, stock: true, img: "baie.png", desc: "Armoire technique sécurisée pour serveurs et interconnexions." },
    { id: 8, title: "Câble Ethernet Cat6 UTP 305m", category: "accessoires", brand: "hp", priceXAF: 120000, stock: true, img: "cable.png", desc: "Bobine de câble réseau haute performance pour déploiements LAN." },
    { id: 9, title: "Disque Dur Externe SanDisk 2TO", category: "accessoires", brand: "apple", priceXAF: 145000, stock: true, img: "sandisk.png", desc: "Stockage SSD externe ultra-rapide pour sauvegardes de données." },
    { id: 10, title: "Station de Travail Dell Precision", category: "materiel", brand: "dell", priceXAF: 3200000, stock: false, img: "dell_workstation.png", desc: "Puissance de calcul extrême pour infographie et calculs lourds." }
];

// TAUX DE CONVERSION (Base 1 XAF)
// TAUX STRICTEMENT CALCULES DEPUIS TES CAPTURES D'ECRAN (Base 1 XAF)
const conversionRates = {
    XAF: 1,
    USD: 0.001736, // Selon image_881304.png (10 000 000 XAF = 17 680 $)
    EUR: 0.001524, // Selon image_88133c.png (10 000 000 XAF = 15 240 €)
    AOA: 1.611350,   // Converti depuis image_881664.png (10 000 000 XAF = 16 235 100 AOA)
    GBP: 0.001315, // Selon image_881664.png (10 000 000 XAF = 12 850 £)
    CDF: 3.956971   // Selon image_881664.png (10 000 000 XAF = 176 800 CDF)
};

const currencySymbols = { XAF: "FCFA", USD: "$", EUR: "€", AOA: "AOA", GBP: "£", CDF: "FC" };

// ÉLÉMENTS DU DOM
const productsGrid = document.getElementById('productsGrid');
const noResultsBox = document.getElementById('noResultsBox');
const priceRange = document.getElementById('priceRange');
const priceDisplay = document.getElementById('priceDisplay');
const currencySelect = document.getElementById('currencySelect');
const brandSelect = document.getElementById('brandSelect');
const keywordSearch = document.getElementById('keywordSearch');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const catButtons = document.querySelectorAll('.btn-cat');

// ÉTAT GLOBAL DE FILTRAGE CONTINU
let currentCurrency = localStorage.getItem('devisePreferee') || 'XAF';
let currentCategory = 'all';
let currentMaxPriceXAF = 10000000; // Toujours stocké en XAF pour éviter les sauts de calculs

function init() {
    // Configuration initiale depuis le stockage local
    currencySelect.value = currentCurrency;
    priceRange.max = 10000000; // Le slider physique reste stable de 0 à 10 000 000
    priceRange.value = currentMaxPriceXAF;

    updatePriceLabel();
    renderProducts();
    
    // Écouteurs d'événements
    currencySelect.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        localStorage.setItem('devisePreferee', currentCurrency);
        updatePriceLabel(); // On met à jour l'affichage mais le prix sélectionné RESTE le même
        renderProducts();
    });

    priceRange.addEventListener('input', (e) => {
        currentMaxPriceXAF = parseFloat(e.target.value); // Ajustement direct en XAF brute
        updatePriceLabel();
        renderProducts();
    });

    brandSelect.addEventListener('change', renderProducts);
    keywordSearch.addEventListener('input', renderProducts);
    resetFiltersBtn.addEventListener('click', resetAllFilters);

    catButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            catButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-category');
            renderProducts();
        });
    });
}

function formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Gère la mise à jour textuelle du label sans toucher à la configuration physique du slider
function updatePriceLabel() {
    const rate = conversionRates[currentCurrency];
    const symbol = currencySymbols[currentCurrency];
    const convertedPriceDisplay = currentMaxPriceXAF * rate;
    priceDisplay.textContent = `${formatNumber(convertedPriceDisplay)} ${symbol}`;
}

// Réinitialisation complète de TOUS les critères
function resetAllFilters() {
    currentCategory = 'all';
    currentMaxPriceXAF = 10000000;
    
    // Reset des éléments physiques du formulaire
    keywordSearch.value = "";
    brandSelect.value = "all";
    priceRange.value = 10000000;
    
    // Reset visuel des boutons de catégorie
    catButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-category="all"]').classList.add('active');
    
    updatePriceLabel();
    renderProducts();
}

function renderProducts() {
    productsGrid.innerHTML = "";
    const selectedBrand = brandSelect.value;
    const searchWord = keywordSearch.value.toLowerCase().trim();
    const rate = conversionRates[currentCurrency];
    const symbol = currencySymbols[currentCurrency];

    let filtered = productsDatabase.filter(p => {
        const matchesCategory = (currentCategory === 'all' || p.category === currentCategory);
        const matchesBrand = (selectedBrand === 'all' || p.brand === selectedBrand);
        const matchesPrice = (p.priceXAF <= currentMaxPriceXAF);
        
        // CORRECTION : Recherche combinée sur le Titre, la Description ET le nom de la Marque
        const matchesKeyword = (
            p.title.toLowerCase().includes(searchWord) || 
            p.desc.toLowerCase().includes(searchWord) ||
            p.brand.toLowerCase().includes(searchWord)
        );
        
        return matchesCategory && matchesBrand && matchesPrice && matchesKeyword;
    });

    // Si aucun produit ne correspond, on affiche la boîte d'alerte avec le bouton réinitialiser
    if (filtered.length === 0) {
        noResultsBox.classList.remove('hidden');
        return;
    }

    noResultsBox.classList.add('hidden');

    filtered.forEach(p => {
        const card = document.createElement('article');
        card.className = "product-premium-card";
        
        const convertedPrice = p.priceXAF * rate;
        const stockBadge = p.stock ? '<span class="badge-stock in">En stock</span>' : '<span class="badge-stock out">Sur commande</span>';

        card.innerHTML = `
            <div class="card-img-container">
                <img src="${p.img}" alt="${p.title}" class="prod-img">
                ${stockBadge}
            </div>
            <div class="card-body">
                <span class="prod-brand">${p.brand.toUpperCase()}</span>
                <h3>${p.title}</h3>
                <p class="prod-desc-short">${p.desc}</p>
                <div class="card-footer-row">
                    <span class="prod-price">${formatNumber(convertedPrice)} ${symbol}</span>
                    <button class="btn-details" onclick="navigateToProduct(${p.id})">Voir tous les détails</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}
function navigateToProduct(id) {
    localStorage.setItem('idProduitCible', id);
    window.location.href = "produit.html";
}

window.addEventListener('DOMContentLoaded', init);