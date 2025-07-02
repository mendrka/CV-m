document.getElementById('settingsBtn').onclick = function() {
    document.getElementById('settingsPanel').classList.remove('hidden');
};
document.getElementById('closeSettings').onclick = function() {
    document.getElementById('settingsPanel').classList.add('hidden');
};
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.onclick = function() {
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-colorful');
        document.body.classList.add('theme-' + btn.dataset.theme);
        document.getElementById('settingsPanel').classList.add('hidden');
        localStorage.setItem('cv-theme', btn.dataset.theme);
    };
});
// Appliquer le thème sauvegardé
const savedTheme = localStorage.getItem('cv-theme');
if(savedTheme) document.body.classList.add('theme-' + savedTheme);
else document.body.classList.add('theme-light');

// Liste complète des classes de disposition
const layoutClasses = ['row', 'column', 'pyramid', 'grid', 'carousel'];

// Gestion de la disposition des projets
const mesProjets = document.getElementById('mesDifferentProjet');
document.querySelectorAll('.layout-btn').forEach(btn => {
    btn.onclick = function() {
        // Retire toutes les classes de disposition
        layoutClasses.forEach(cls => mesProjets.classList.remove(cls));
        // Ajoute la nouvelle classe
        mesProjets.classList.add(btn.dataset.layout);

        // Affiche selon le layout
        if (btn.dataset.layout === 'pyramid') {
            renderPyramid();
        } else {
            renderRowColumn();
        }
        localStorage.setItem('cv-layout', btn.dataset.layout);
    };
});

// Fonction pour affichage row/column/grid/carousel
function renderRowColumn() {
    // Ne vide pas le HTML, laisse les projets en place
    // (optionnel : tu peux réordonner ici si besoin)
}

// Fonction pour affichage pyramide
function renderPyramid() {
    const projets = Array.from(mesProjets.querySelectorAll('.projet'));
    mesProjets.innerHTML = '';
    // Ex: 1, 2, 3, 2 (pour 8 projets)
    const rows = [[0], [1,2], [3,4,5], [6,7]];
    rows.forEach(indexes => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'pyramid-row';
        indexes.forEach(i => {
            if (projets[i]) rowDiv.appendChild(projets[i]);
        });
        mesProjets.appendChild(rowDiv);
    });
}

// Appliquer la disposition sauvegardée
const savedLayout = localStorage.getItem('cv-layout');
if(savedLayout) {
    document.querySelector(`.layout-btn[data-layout="${savedLayout}"]`)?.click();
} else {
    mesProjets.classList.add('row');
    renderRowColumn();
}

// Palette de couleurs principales (tes préférées)
const mainColors = [
    '#43cea2', // vert clair
    '#5fd0ff', // bleu clair
    '#ffb347', // orange clair
    '#ff7b7b', // rouge clair
    '#fff8b7'  // jaune clair
];

// Génère des étapes intermédiaires pour une transition douce
function generateColorSteps(colors, stepsPerTransition = 50) {
    const steps = [];
    for (let i = 0; i < colors.length; i++) {
        const from = colors[i];
        const to = colors[(i + 1) % colors.length];
        for (let s = 0; s < stepsPerTransition; s++) {
            const t = s / stepsPerTransition;
            steps.push(lerpColor(from.replace('#',''), to.replace('#',''), t));
        }
    }
    return steps;
}

let colorSteps = generateColorSteps(mainColors, 80); // 80 étapes par transition
let colorStepIndex = 0;
let colorInterval;

function lerpColor(a, b, t) {
    // Interpolation linéaire entre deux couleurs hex
    const ah = a.match(/\w\w/g).map(x => parseInt(x,16));
    const bh = b.match(/\w\w/g).map(x => parseInt(x,16));
    const rh = ah.map((v,i) => Math.round(v + (bh[i]-v)*t));
    return '#' + rh.map(x => x.toString(16).padStart(2,'0')).join('');
}

function animateColorfulTheme() {
    if (!document.body.classList.contains('theme-colorful')) return;
    const color = colorSteps[colorStepIndex];
    const nextColor = colorSteps[(colorStepIndex + 1) % colorSteps.length];
    document.body.style.background = `linear-gradient(120deg, ${color}, ${nextColor})`;
    colorStepIndex = (colorStepIndex + 1) % colorSteps.length;
}

function startColorfulAnimation() {
    if (colorInterval) clearInterval(colorInterval);
    colorStepIndex = 0;
    if (document.body.classList.contains('theme-colorful')) {
        // 50ms = ~4s par couleur, très doux
        colorInterval = setInterval(animateColorfulTheme, 50);
    }
}
function stopColorfulAnimation() {
    if (colorInterval) clearInterval(colorInterval);
    document.body.style.background = '';
}

// Relance l'animation à chaque changement de thème
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        stopColorfulAnimation();
        if (btn.dataset.theme === 'colorful') startColorfulAnimation();
    });
});

// Si le thème coloré est actif au chargement
if (document.body.classList.contains('theme-colorful')) startColorfulAnimation();

// Apparition animée des sections au scroll (adapte au style .cv-section.visible)
document.querySelectorAll('.cv-section').forEach(section => {
    section.classList.remove('visible');
});
function revealSectionsOnScroll() {
    document.querySelectorAll('.cv-section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            section.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealSectionsOnScroll);
window.addEventListener('DOMContentLoaded', revealSectionsOnScroll);

// Validation simple du formulaire de contact (adapte au style #contactSuccess)
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');
if(contactForm) {
    contactForm.onsubmit = function(e) {
        e.preventDefault();
        let valid = true;
        contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
            if(!input.value.trim()) valid = false;
        });
        if(valid) {
            contactSuccess.style.display = 'block';
            setTimeout(() => { contactSuccess.style.display = 'none'; }, 4000);
            contactForm.reset();
        }
    };
}

// Gestion des étoiles pour les commentaires (adapte au style .star-rating .active)
const starRating = document.getElementById('starRating');
const starInput = document.getElementById('commentStars');
let currentStars = 5;
if(starRating && starInput) {
    starRating.querySelectorAll('span').forEach(star => {
        star.addEventListener('mouseenter', function() {
            highlightStars(this.dataset.star);
        });
        star.addEventListener('mouseleave', function() {
            highlightStars(currentStars);
        });
        star.addEventListener('click', function() {
            currentStars = this.dataset.star;
            starInput.value = currentStars;
            highlightStars(currentStars);
        });
    });
    function highlightStars(count) {
        starRating.querySelectorAll('span').forEach(star => {
            star.classList.toggle('active', star.dataset.star <= count);
        });
    }
    highlightStars(currentStars);
}

// Gestion des commentaires (stockés en localStorage, adapte au style .comment-item et .contacted-list)
const commentForm = document.getElementById('commentForm');
const commentsList = document.getElementById('commentsList');
const contactedList = document.getElementById('contactedList');

function renderComments() {
    if(!commentsList || !contactedList) return;
    const comments = JSON.parse(localStorage.getItem('cv-comments') || '[]');
    commentsList.innerHTML = '';
    comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = `
            <div class="comment-stars">${'★'.repeat(c.stars)}${'☆'.repeat(5-c.stars)}</div>
            <strong>${c.name}</strong><br>
            <span>${c.text}</span>
        `;
        commentsList.appendChild(div);
    });
    // Mini-liste des personnes ayant commenté
    const names = [...new Set(comments.map(c => c.name))];
    contactedList.innerHTML = names.length
        ? `<div class="contacted-list-title">Ils m'ont déjà contacté :</div>
           <ul>${names.map(n => `<li>${n}</li>`).join('')}</ul>`
        : '';
}

if(commentForm) {
    commentForm.onsubmit = function(e) {
        e.preventDefault();
        const name = document.getElementById('commentName').value.trim();
        const text = document.getElementById('commentText').value.trim();
        const stars = parseInt(document.getElementById('commentStars').value, 10) || 5;
        if(name && text) {
            const comments = JSON.parse(localStorage.getItem('cv-comments') || '[]');
            comments.unshift({name, text, stars});
            localStorage.setItem('cv-comments', JSON.stringify(comments));
            renderComments();
            commentForm.reset();
            currentStars = 5;
            if(typeof highlightStars === "function") highlightStars(currentStars);
            starInput.value = 5;
        }
    };
    renderComments();
}

// Les autres scripts (thèmes, disposition, etc.) restent inchangés
