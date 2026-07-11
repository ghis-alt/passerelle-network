// On récupère les mêmes taux pour synchroniser la monnaie choisie au catalogue
const conversionRates = { XAF: 1, USD: 0.001768, EUR: 0.001524, AOA: 1.62351 };
const currencySymbols = { XAF: "FCFA", USD: "$", EUR: "€", AOA: "AOA" };

const productsDatabase = [
    { id: 1, title: "Routeur Cisco ISR 4331", category: "reseaux", brand: "cisco", priceXAF: 2450000, stock: true, img: "routeur.png", desc: "Routeur de services intégrés pour liaisons spécialisées d'entreprises.", cap: "Débit applicatif de 100 Mbps extensible à 300 Mbps, 3 ports WAN/LAN natifs, sécurité avancée intégrée avec chiffrement matériel." },
    { id: 2, title: "Souris", category: "accessoires", brand: "hp", priceXAF: 9000, stock: true, img: "souris.png", desc: "Souris optique pour un usage professionnel.", cap: "Capacité de défilement à 10 000 points, design ergonomique, compatibilité avec les systèmes d'exploitation Windows et macOS." },
    { id: 3, title: "PC Portable HP Latitude 5440", category: "materiel", brand: "hp", priceXAF: 850000, stock: true, img: "ordinateur-hp.png", desc: "Ordinateur professionnel Intel Core i5, 16GB RAM, 512GB SSD.", cap: "Processeur Intel de dernière génération, écran 14 pouces Full HD antireflet, autonomie longue durée supérieure à 10h, châssis renforcé." },
    { id: 4, title: "Serveur Rack HP ProLiant DL360", category: "materiel", brand: "hp", priceXAF: 4800000, stock: false, img: "serveur.png", desc: "Performances de calcul denses pour centres de données et virtualisation.", cap: "Architecture bi-processeur Intel Xeon Scalable, 64GB DDR4 ECC SmartMemory, contrôleur Smart Array haute performance, châssis rackable compact 1U." },
    { id: 5, title: "iPhone 15 Pro Max 256GB", category: "accessoires", brand: "apple", priceXAF: 980000, stock: true, img: "iphone.png", desc: "Smartphone iOS haut de gamme avec châssis en titane et optique pro.", cap: "Puce A17 Pro ultra-puissante, système photo pro objectif principal 48 Mpx, zoom optique 5x, autonomie record pour utilisation mobile." },
    { id: 6, title: "PC Portable Acer Aspire 5", category: "materiel", brand: "acer", priceXAF: 450000, stock: true, img: "ordinateur.png", desc: "Ordinateur polyvalent idéal pour la bureautique et les formations.", cap: "Processeur AMD Ryzen 5, 8GB RAM, 512GB SSD, écran large de 15.6 pouces, clavier complet rétroéclairé, parfait pour monter en compétences." },
    { id: 7, title: "Clé USB Kingston 32GB", category: "accessoires", brand: "kingston", priceXAF: 8000, stock: true, img: "USB.png", desc: "Clé USB de stockage portable avec une capacité élevée.", cap: "Vitesse de lecture jusqu'à 100MB/s, compatible USB 3.0 et rétrocompatible USB 2.0, design compact et robuste pour transport facile." },
    { id: 8, title: "Câble Reseau Ethernet Cat6 Snagless 5m", category: "accessoires", brand: "hp", priceXAF: 120000, stock: true, img: "ethernet.png", desc: "Bobine de câble réseau RJ45 haute performance pour déploiements LAN.", cap: "Conducteur en cuivre pur pour transmission optimale sans perte, gaine PVC résistante pour passages internes, rétrocompatible avec les installations Cat5e." },
    { id: 9, title: "Imprimante Laser HP LaserJet Pro MFP", category: "accessoires", brand: "hp", priceXAF: 145000, stock: true, img: "imprimante.png", desc: "Imprimante laser multifonctions pour les environnements professionnels.", cap: "Fonctionnalités d'impression, copie et numérisation avancées, connectivité Wi-Fi et Ethernet, sécurité intégrée." },
    { id: 10, title: "Téléphone IP Cisco SPA504G", category: "accessoires", brand: "cisco", priceXAF: 180000, stock: true, img: "telephone.png", desc: "Téléphone IP professionnel avec écran TFT couleur et fonctionnalités avancées.", cap: "Écran TFT 3.5 pouces couleur, 12 touches de raccourci programmables, compatibilité SIP, sécurité intégrée." }
];

function formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function loadProductData() {
    const activeId = parseInt(localStorage.getItem('idProduitCible')) || 1;
    const activeCurrency = localStorage.getItem('devisePreferee') || 'XAF';
    
    const prod = productsDatabase.find(p => p.id === activeId);
    const specsSheet = document.getElementById('productSpecsSheet');

    if (!prod) {
        specsSheet.innerHTML = `<p>Produit introuvable.</p>`;
        return;
    }

    const priceConvs = prod.priceXAF * conversionRates[activeCurrency];
    const symb = currencySymbols[activeCurrency];
    const badgeHtml = prod.stock ? '<span class="badge-stock-large in">Disponible en stock</span>' : '<span class="badge-stock-large out">Disponible sur commande</span>';

    specsSheet.innerHTML = `
        <div class="specs-grid">
            <div class="specs-left-visual">
                <div class="main-image-holder">
                    <img src="${prod.img}" alt="${prod.title}">
                </div>
            </div>
            <div class="specs-right-details">
                <span class="tech-tag">${prod.category.toUpperCase()} &bull; ${prod.brand.toUpperCase()}</span>
                <h1 class="specs-title">${prod.title}</h1>
                <div class="specs-meta-row">
                    ${badgeHtml}
                    <span class="specs-price">${formatNumber(priceConvs)} ${symb}</span>
                </div>
                <div class="divider-line"></div>
                <div class="specs-body-text">
                    <h3>Description Générale</h3>
                    <p>${prod.desc}</p>
                    
                    <h3>Capacités & Fonctionnalités Techniques</h3>
                    <p class="capabilities-text">${prod.cap}</p>
                </div>
            </div>
        </div>
    `;
}

// ANIMATION DU CANVAS DE CONSTELLATION FONDS DE BOULES (MÊME CODE QUE SERVICES)
const canvas = document.getElementById('constellationCanvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
const numberOfParticles = 35;

function initCanvas() {
    const section = document.getElementById('productConstellationSection');
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 4; 
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = 'rgba(30, 58, 109, 0.25)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function setupParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function drawLines() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dist = Math.hypot(particlesArray[a].x - particlesArray[b].x, particlesArray[a].y - particlesArray[b].y);
            if (dist < 150) {
                ctx.strokeStyle = `rgba(30, 58, 109, ${0.15 - (dist/150)*0.15})`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateConstellation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateConstellation);
}

window.addEventListener('load', () => {
    loadProductData();
    initCanvas();
    setupParticles();
    animateConstellation();
});
window.addEventListener('resize', initCanvas);

// =========================================================================
// INTERCEPTION DU CLIC POUR TRANSFÉRER LE NOM DU PRODUIT À LA PAGE CONTACT
// =========================================================================
function setupContactLinkTracker() {
    const contactBtn = document.getElementById('ctaProductContact');
    
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            // On récupère dynamiquement le titre du produit injecté dans le H1
            const productTitleElement = document.querySelector('.specs-title');
            
            if (productTitleElement) {
                const productName = productTitleElement.textContent;
                // Sauvegarde pour que la page contact.js le lise à l'arrivée
                localStorage.setItem('nomProduitCible', productName);
            }
        });
    }
}

// MISE À JOUR DE TON ÉVÉNEMENT 'LOAD' EXISTANT
window.addEventListener('load', () => {
    loadProductData();
    setupContactLinkTracker(); // <-- AJOUTE CETTE LIGNE ICI
    initCanvas();
    setupParticles();
    animateConstellation();
});

