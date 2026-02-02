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

    // Inyectar CSS de Revista si no existe
    if (!content.includes('href="../magazine.css"')) {
        content = content.replace('</head>', '    <link rel="stylesheet" href="../magazine.css">\n</head>');
    }

    // Inyectar JS de Revista al final del body si no existe
    if (!content.includes('src="../magazine.js"')) {
        content = content.replace('</body>', '    <script src="../magazine.js"></script>\n</body>');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Actualizado con Modo Revista: ${file}`);
});