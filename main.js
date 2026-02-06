document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // CONFIGURACIÓN DE ARTÍCULOS (HOME)
    // ==========================================
    const articlesData = {
        "adriana-campione": {
            title: "Neuroeducación y Competencias Emocionales: Sinergias para el Aprendizaje en Entornos Multimodales",
            author: "Adriana Campione",
            image: "./Doctorandos/Adriana Campione/Fotos/Foto Adriana Campione S.jpg",
            abstract: "Un análisis sobre cómo la arquitectura sináptica cambia con la experiencia y la importancia del encuadre afectivo para consolidar la memoria en entornos multimodales.",
            link: "pages/adriana-campione.html"
        },
        "behzaida-trias": {
            title: "La Interrelación entre Educación 5.0, Heutagogía y Multimodalidad",
            author: "Behzaida Trías",
            image: "./Doctorandos/Behzaida Trías/Fotos/BEHZAIDA FOTO.png",
            abstract: "Un imperativo ético más allá de la tecnología. La heutagogía activa la 'doble vuelta' de aprendizaje para cuestionar esquemas mentales.",
            link: "pages/behzaida-trias.html"
        },
        "israel-hernandez": {
            title: "¿Aprender para el examen o para la vida? Multimodalidad y la neuroplasticidad del significado",
            author: "Israel Hernández",
            image: "./Doctorandos/Israel Hernández/Fotos/ih fin.png",
            abstract: "Crítica al procesamiento superficial. La multimodalidad permite la 'transducción' y el recableado neurosensorial.",
            link: "pages/israel-hernandez.html"
        },
        "leina-arcila": {
            title: "¿Tecnología que libera o controla? La dialéctica educativa en la era multimodal",
            author: "Leina Arcila",
            image: "./Doctorandos/Leina Arcila/Fotos/1700437394461-01.jpg",
            abstract: "Análisis basado en la teoría ACT-R y la semiótica de Kress. ¿Son las analíticas herramientas de control o de metacognición?",
            link: "pages/leina-arcila.html"
        },
        "lily-prieto": {
            title: "Modelo VARK, Multimodalidad y Gamificación para Combatir la Procrastinación",
            author: "Lily Prieto",
            image: "./Doctorandos/Lily Prieto/FOTOS/LILY MAR.jpg",
            abstract: "Propuesta que integra perfiles sensoriales (Visual, Auditivo, etc.) y recompensas dopaminérgicas en tesis doctorales.",
            link: "pages/lily-prieto.html"
        },
        "lisette-de-freitas": {
            title: "Brecha Digital en la Educación Multimodal Inclusiva",
            author: "Lisette De Freitas",
            image: "./Doctorandos/Lisette De Freitas/Fotos/Lisette De Freitas Montero.jpg",
            abstract: "La inclusión trasciende el acceso físico; implica participación epistémica. Disparidades estructurales post-COVID.",
            link: "pages/lisette-de-freitas.html"
        },
        "maria-martinez": {
            title: "Del Aula Estática al Ecosistema Expandido: Cápsulas Multimodales",
            author: "María Martínez",
            image: "./Doctorandos/María Martínez/Fotos/foto perfil Maria Martinez.png",
            abstract: "La revolución de las 'Cápsulas Educativas'. El docente evoluciona a curador de contenidos en un ecosistema ubicuo.",
            link: "pages/maria-martinez.html"
        },
        "melisa-romero": {
            title: "El impacto de la enseñanza multimodal en el aprendizaje",
            author: "Melisa Romero",
            image: "./Doctorandos/Melisa Romero/Fotos/Foto Melisa Romero.JPG",
            abstract: "Fundamentado en Mayer (2020). Los entornos multimodales bien diseñados reducen la carga cognitiva y catalizan el pensamiento crítico.",
            link: "pages/melisa-romero.html"
        },
        "tomas-perez": {
            title: "Evaluación Inmersiva 5.0, Pensamiento Crítico y Multimodalidad",
            author: "Tomás Pérez",
            image: "./Doctorandos/Tomás Pérez/Fotos/Tomas Perez.png",
            abstract: "Exploración de cómo las nuevas tecnologías pueden potenciar el pensamiento crítico y la multimodalidad en la educación superior.",
            link: "pages/tomas-perez.html"
        }
    };

    // ==========================================
    // RENDERIZADO DE TARJETAS (SOLO EN HOME)
    // ==========================================
    const gridContainer = document.getElementById('articles-grid');

    if (gridContainer) {
        Object.keys(articlesData).forEach(key => {
            const art = articlesData[key];
            const card = document.createElement('article');
            card.className = 'card scroll-reveal';

            const fallbackImage = `https://placehold.co/600x400/002147/C5A059?text=${encodeURIComponent(art.author)}`;

            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${art.image}" alt="${art.author}" onerror="this.onerror=null;this.src='${fallbackImage}';">
                </div>
                <div class="card-content">
                    <div class="card-tags"><span class="tag">Investigación</span></div>
                    <div class="card-author">${art.author}</div>
                    <h3>${art.title}</h3>
                    <p class="card-summary">${art.abstract}</p>
                    <div class="card-footer">
                        <a href="${art.link}" class="btn-text">Leer Artículo completo &rarr;</a>
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });
        
        initVisualEffects();
    }

    // ==========================================
    // EFECTOS VISUALES
    // ==========================================
    function initVisualEffects() {
        // 1. Sticky Navbar
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // 2. Scroll Reveal
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const cards = document.querySelectorAll('.scroll-reveal');
        cards.forEach(card => observer.observe(card));

        // 3. Smooth Scroll Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling issues
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
            console.log('Toggle Menu:', navLinks.classList.contains('active'));
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
            }
        });
    }
});
