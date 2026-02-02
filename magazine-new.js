document.addEventListener('DOMContentLoaded', () => {
    // Detectar si estamos en móvil para activar el modo revista
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        enableMagazineMode();
    }
});

let isMagazineActive = false;
let originalContentHTML = ''; // Para guardar el estado original

function enableMagazineMode() {
    if (isMagazineActive) return;
    isMagazineActive = true;

    const mainContent = document.querySelector('.article-body');
    if (!mainContent) return;

    // Guardar contenido original por seguridad (aunque en móvil no se desactiva)
    if (!originalContentHTML) originalContentHTML = mainContent.innerHTML;

    // Obtener elementos hijos
    const children = Array.from(mainContent.children);
    
    // Contenedor de la revista
    const magazineContainer = document.createElement('div');
    magazineContainer.className = 'magazine-view';

    // Algoritmo de Paginación Simple
    let currentPage = createPageElement(1);
    let currentPageWeight = 0; 
    const MAX_WEIGHT = 4;

    children.forEach((child) => {
        if (child.tagName === 'SCRIPT' || child.innerHTML.trim() === '') return;

        const clone = child.cloneNode(true);
        // Desactiva floats en las imágenes cloradas para evitar problemas de layout en modo revista
        if (clone.classList.contains('article-image')) {
            clone.classList.remove('float-left', 'float-right');
        }

        let weight = 1;

        if (clone.querySelector('img') || clone.tagName === 'IMG' || clone.classList.contains('article-image')) {
            weight = 3;
            if (currentPageWeight > 1) currentPageWeight = MAX_WEIGHT + 1; 
        }

        if (clone.tagName === 'H2') {
            if (currentPageWeight > 0) currentPageWeight = MAX_WEIGHT + 1;
        }

        if (currentPageWeight >= MAX_WEIGHT) {
            magazineContainer.appendChild(currentPage);
            currentPage = createPageElement(magazineContainer.children.length + 1);
            currentPageWeight = 0;
        }

        currentPage.querySelector('.page-content').appendChild(clone);
        currentPageWeight += weight;
    });

    if (currentPage.querySelector('.page-content').children.length > 0) {
        magazineContainer.appendChild(currentPage);
    }

    document.body.classList.add('magazine-mode-active');
    
    const wrapper = document.createElement('div');
    wrapper.id = 'magazine-wrapper';
    wrapper.appendChild(magazineContainer);
    
    // Indicador sutil
    const controls = document.createElement('div');
    controls.className = 'magazine-controls';
    controls.innerHTML = `<span class="page-indicator">Desliza <span class="arrow">→</span></span>`;
    wrapper.appendChild(controls);

    document.body.appendChild(wrapper);

    // --- ANIMACIÓN CON INTERSECTION OBSERVER ---
    // Detecta qué página está en el centro para animarla
    setupPageObserver(magazineContainer);
}

function createPageElement(pageNum) {
    const page = document.createElement('section');
    page.className = 'magazine-page';
    page.innerHTML = `
        <div class="page-inner">
            <div class="page-header">REVISTA TIC • Pág ${pageNum}</div>
            <div class="page-content"></div>
        </div>
    `;
    return page;
}

function setupPageObserver(container) {
    // Configuración del observer: 50% de visibilidad requerida
    const options = {
        root: container,
        threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Quitar clase activa de otros y ponerla en el actual
                document.querySelectorAll('.magazine-page').forEach(p => p.classList.remove('active-page'));
                entry.target.classList.add('active-page');
            }
        });
    }, options);

    container.querySelectorAll('.magazine-page').forEach(page => {
        observer.observe(page);
    });
}
