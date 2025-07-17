const fs = require('fs').promises;
const path = require('path');

async function renameFiles() {
    try {
        // Rutas de los archivos
        const buildDir = path.join(__dirname, '../build');
        const cssPath = path.join(buildDir, 'static/css');
        const jsPath = path.join(buildDir, 'static/js');

        // Obtener los archivos con hash
        const cssFiles = await fs.readdir(cssPath);
        const jsFiles = await fs.readdir(jsPath);

        // Crear copias de archivos CSS
        const cssFile = cssFiles.find(file => file.startsWith('main.') && file.endsWith('.css'));
        if (cssFile) {
            await fs.copyFile(
                path.join(cssPath, cssFile),
                path.join(cssPath, 'main.css')
            );
        }

        // Crear copias de archivos JS
        const jsFile = jsFiles.find(file => file.startsWith('main.') && file.endsWith('.js'));
        if (jsFile) {
            await fs.copyFile(
                path.join(jsPath, jsFile),
                path.join(jsPath, 'main.js')
            );
        }

        console.log('Archivos renombrados exitosamente!');
    } catch (error) {
        console.error('Error al renombrar archivos:', error);
    }
}

renameFiles();
