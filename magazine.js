document.addEventListener('DOMContentLoaded', () => {
    checkMagazineMode();
});

// Detectar cambios de tamaño (ej: rotar pantalla o DevTools)
window.addEventListener('resize', () => {
    // Pequeño debounce para no sobrecargar
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(checkMagazineMode, 200);
});

function checkMagazineMode() {
    // Detectar si estamos en móvil para activar el modo revista
    // Aumentamos un poco el rango para abarcar tablets verticales
    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
        enableMagazineMode();
    } else {
        disableMagazineMode();
    }
}

let isMagazineActive = false;
let originalContentHTML = ''; // Para guardar el estado original

function disableMagazineMode() {
    if (!isMagazineActive) return;
    
    // Restaurar contenido original
    const mainContent = document.querySelector('.article-body');
    if (mainContent && originalContentHTML) {
        // Restaurar HTML limpio
        mainContent.innerHTML = originalContentHTML;
    }

    // Limpiar clases y elementos inyectados
    isMagazineActive = false;
    document.body.classList.remove('magazine-mode-active');
    
    const wrapper = document.getElementById('magazine-wrapper');
    if (wrapper) wrapper.remove();
}

function toggleMagazineMode() {
    if (isMagazineActive) {
        disableMagazineMode();
    } else {
        enableMagazineMode();
    }
}

function enableMagazineMode() {
    if (isMagazineActive) return;
    isMagazineActive = true;

    const mainContent = document.querySelector('.article-body');
    if (!mainContent) return;

    // Guardar contenido original para poder restaurarlo
    if (!originalContentHTML) originalContentHTML = mainContent.innerHTML;

    // Obtener todos los elementos hijos (párrafos, imágenes, títulos)
    // Usamos una copia de los nodos para no destruir el DOM original inmediatamente
    const children = Array.from(mainContent.children);
    
    // Contenedor de la revista
    const magazineContainer = document.createElement('div');
    magazineContainer.className = 'magazine-view';

    // Algoritmo de Paginación Simple
    // Agrupa elementos hasta llenar una "página" conceptual
    let currentPage = createPageElement(1);
    let currentPageWeight = 0; // Peso aproximado (texto = 1, imagen = 3)
    const MAX_WEIGHT = 4; // Umbral para cambiar de página

    children.forEach((child, index) => {
        // Ignorar scripts o elementos vacíos
        if (child.tagName === 'SCRIPT' || child.innerHTML.trim() === '') return;

        const clone = child.cloneNode(true);
        // Desactiva floats en las imágenes cloradas para evitar problemas de layout
        if (clone.classList.contains('article-image')) {
            clone.classList.remove('float-left', 'float-right');
        }

        let weight = 1;

        // Las imágenes pesan más
        if (clone.querySelector('img') || clone.tagName === 'IMG' || clone.classList.contains('article-image')) {
            weight = 3;
            // Si ya hay algo en la página y viene una imagen, forzar nueva página a veces
            if (currentPageWeight > 1) currentPageWeight = MAX_WEIGHT + 1; 
        }

        // Títulos grandes (h2) preferiblemente inician página
        if (clone.tagName === 'H2') {
            if (currentPageWeight > 0) currentPageWeight = MAX_WEIGHT + 1;
        }

        // Si se supera el peso, guardar página y crear nueva
        if (currentPageWeight >= MAX_WEIGHT) {
            magazineContainer.appendChild(currentPage);
            currentPage = createPageElement(magazineContainer.children.length + 2); // +2 para compensar index
            currentPageWeight = 0;
        }

        currentPage.querySelector('.page-content').appendChild(clone);
        currentPageWeight += weight;
    });

    // Agregar la última página si tiene contenido
    if (currentPage.querySelector('.page-content').children.length > 0) {
        magazineContainer.appendChild(currentPage);
    }

    // Reemplazar el contenido del body normal por la revista
    document.body.classList.add('magazine-mode-active');
    
    // Ocultar elementos normales (Header y Footer se ocultan por CSS en modo revista)
    const wrapper = document.createElement('div');
    wrapper.id = 'magazine-wrapper';
    wrapper.appendChild(magazineContainer);
    
    // Inyectar controles de navegación
    const controls = document.createElement('div');
    controls.className = 'magazine-controls';
    controls.innerHTML = `
        <span class="page-indicator">Desliza para leer <span class="arrow">→</span></span>
    `;
    wrapper.appendChild(controls);

    document.body.appendChild(wrapper);

    // --- ANIMACIÓN CON INTERSECTION OBSERVER ---
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
    // Configuración del observer: 60% de visibilidad requerida
    const options = {
        root: container,
        threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.magazine-page').forEach(p => p.classList.remove('active-page'));
                entry.target.classList.add('active-page');
            }
        });
    }, options);

    container.querySelectorAll('.magazine-page').forEach(page => {
        observer.observe(page);
    });
}

function disableMagazineMode() {
    isMagazineActive = false;
    document.body.classList.remove('magazine-mode-active');
    
    const wrapper = document.getElementById('magazine-wrapper');
    if (wrapper) wrapper.remove();
}
