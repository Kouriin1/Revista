const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');

if (!fs.existsSync(pagesDir)) {
    console.error("No encuentro la carpeta 'pages'.");
    process.exit(1);
}

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Corregir CSS
    content = content.replace('href="styles.css"', 'href="../styles.css"');

    // 2. Corregir Enlaces de Navegación (Inicio y Volver)
    // Reemplaza "index.html" por "../index.html" PERO ten cuidado de no reemplazarlo si ya tuviera "../" (aunque sabemos que no lo tiene)
    // Usamos regex global
    content = content.replace(/href="index\.html"/g, 'href="../index.html"');
    content = content.replace(/href="index\.html#articles"/g, 'href="../index.html#articles"');

    // 3. Corregir Rutas de Imágenes (Doctorandos/...)
    // Buscamos src="Doctorandos/ y lo cambiamos a src="../Doctorandos/
    content = content.replace(/src="Doctorandos\//g, 'src="../Doctorandos/');
    
    // Extra: Corregir también si hay algún href que apunte a Doctorandos (raro, pero posible)
    content = content.replace(/href="Doctorandos\//g, 'href="../Doctorandos/');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Corregido: ${file}`);
});
