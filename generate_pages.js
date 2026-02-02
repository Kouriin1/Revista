const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 1. Datos base extraídos de main.js (simplificado para no parsear el JS complejo)
const articulos = [
    { autor: "Adriana Campione", carpeta: "Adriana Campione", titulo: "Sinergias: Neuroeducación y Competencias Emocionales" },
    { autor: "Behzaida Trías", carpeta: "Behzaida Trías", titulo: "Educación 5.0 y Heutagogía: La Esencia Humana" },
    { autor: "Israel Hernández", carpeta: "Israel Hernández", titulo: "Neuroplasticidad del Significado: ¿Examen o Vida?" },
    { autor: "Leina Arcila", carpeta: "Leina Arcila", titulo: "Dialéctica Educativa: ¿Tecnología que Libera o Controla?" },
    { autor: "Lily Prieto", carpeta: "Lily Prieto", titulo: "Vencer la Procrastinación: Modelo VARK y Gamificación" },
    { autor: "Lisette De Freitas", carpeta: "Lisette De Freitas", titulo: "Brecha Digital en la Educación Multimodal Inclusiva" },
    { autor: "María Martínez", carpeta: "María Martínez", titulo: "Del Aula Estática al Ecosistema Expandido" },
    { autor: "Melisa Romero", carpeta: "Melisa Romero", titulo: "Enseñanza Multimodal y Pensamiento Reflexivo" },
    { autor: "Tomás Pérez", carpeta: "Tomás Pérez", titulo: "Pensamiento Crítico en la Educación 5.0" }
];

const templateStart = (titulo, autor, fotoPerfil) => `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo} | Revista TIC 2026-1</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="navbar scrolled">
        <div class="container nav-container">
            <div class="logo">REVISTA <span class="highlight">TIC</span> 2026-1</div>
            <ul class="nav-links">
                <li><a href="index.html">Inicio</a></li>
                <li><a href="index.html#articles">Investigaciones</a></li>
            </ul>
        </div>
    </nav>

    <header class="article-header">
        <div class="container">
            <h1>${titulo}</h1>
            <div class="article-meta">
                <img src="${fotoPerfil}" alt="${autor}" class="article-author-img">
                <span class="article-author-name">Por: ${autor}</span>
            </div>
        </div>
    </header>

    <main class="container article-body">
        <div class="article-content-placeholder" style="background: #fff3cd; padding: 2rem; border-left: 5px solid #ffc107; color: #856404; margin-bottom: 2rem;">
            <strong>⚠️ ESPACIO PARA EL CONTENIDO:</strong><br>
            Aquí debes pegar el texto completo del documento Word que se encuentra en: <br>
            <em>Doctorandos/${autor}/Texto/...</em>
            <br><br>
            Puedes borrar este recuadro y pegar tus párrafos usando etiquetas &lt;p&gt;.
        </div>
        
        <!-- Ejemplo de estructura de texto -->
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        
        <h2>Subtítulo de la Investigación</h2>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

        <!-- Galería Automática -->
        <div class="article-gallery">
            <h3 class="gallery-title">Galería de Referencia</h3>
            <div class="gallery-grid">
`;

const templateEnd = `
            </div>
        </div>

        <a href="index.html" class="back-link">&larr; Volver al índice</a>
    </main>

    <footer>
        <div class="container footer-content">
            <div class="footer-brand">Revista TIC</div>
            <p>&copy; 2026 Doctorado en Innovación y Tecnología.</p>
        </div>
    </footer>
</body>
</html>`;

function cleanPath(p) {
    // Reemplazar backslashes por slashes y escapar espacios si fuera necesario para URL, 
    // pero en HTML local los espacios suelen funcionar si están entre comillas, o usar encodeURI.
    return p.split(path.sep).join('/');
}

// Ejecución
console.log("Generando páginas...");

articulos.forEach(art => {
    // 1. Encontrar Foto Perfil
    const fotosPath = path.join('Doctorandos', art.carpeta);
    // Buscamos cualquier imagen en la carpeta raíz del autor o subcarpetas de fotos
    // Usaremos glob para encontrar la imagen de perfil que ya se usa en main.js o similar
    // Para simplificar, buscaremos en "Doctorandos/[Autor]/Fotos/*"
    const profileGlob = `Doctorandos/${art.carpeta}/Fotos/*.{jpg,png,jpeg,JPG,PNG}`;
    let profilePic = "";
    
    const profileMatches = glob.sync(profileGlob);
    if (profileMatches.length > 0) {
        profilePic = cleanPath(profileMatches[0]);
    } else {
        profilePic = "https://placehold.co/100x100?text=Foto";
    }

    // 2. Encontrar Imágenes Referenciales
    // Pattern: Doctorandos/[Autor]/imágenes referenciales/**/*
    // Nota: "imágenes referenciales" tiene tilde en el nombre de carpeta en el sistema de archivos según el listado anterior?
    // En el listado vi "imágenes referenciales" (con 'a' + 'combining acute accent' o 'á'). 
    // El glob es sensible. Intentaremos un match amplio.
    
    const refGlob = `Doctorandos/${art.carpeta}/**/*referenciales/**/*.{jpg,png,jpeg,JPG,PNG,webp}`;
    const refMatches = glob.sync(refGlob);
    
    let galleryHTML = "";
    refMatches.forEach(img => {
        const imgPath = cleanPath(img);
        // Codificar la URL para que funcionen los espacios y caracteres especiales
        const urlPath = imgPath.split('/').map(encodeURIComponent).join('/');
        galleryHTML += `<div class="gallery-item"><img src="${urlPath}" alt="Imagen Referencial"></div>\n`;
    });

    // 3. Generar Filename
    // Normalizar nombre: "Adriana Campione" -> "adriana-campione.html"
    const filename = art.autor.toLowerCase().replace(/ /g, '-').replace(/[áéíóúñ]/g, (m) => {
        return {'á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n'}[m];
    }) + '.html';

    // 4. Escribir Archivo
    const fullContent = templateStart(art.titulo, art.autor, cleanPath(profilePic).split('/').map(encodeURIComponent).join('/')) + galleryHTML + templateEnd;
    
    fs.writeFileSync(filename, fullContent, 'utf8');
    console.log(`Generado: ${filename}`);
});
