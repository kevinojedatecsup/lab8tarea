const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Evitar solicitud de favicon.ico
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Separa la ruta del archivo de los parámetros de la URL (?nombre=...&email=...)
  const rutaSinQuery = req.url.split('?')[0];

  // Si piden la raíz ("/"), servimos index.html por defecto
  const urlPath = rutaSinQuery === '/' ? '/index.html' : rutaSinQuery;

  // Obtén la ruta absoluta del archivo solicitado
  const filePath = path.join(__dirname, 'public', urlPath);

  console.log('Ruta del archivo solicitado:', filePath);

  // Verifica que el archivo/carpeta exista antes de inspeccionarlo
  if (!fs.existsSync(filePath)) {
    console.error('Archivo no encontrado:', filePath);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Página no encontrada</h1>');
    return;
  }

  // Verifica si filePath es un archivo o un directorio
  if (fs.statSync(filePath).isDirectory()) {
    console.error('Se intentó leer un directorio:', filePath);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('Error del servidor');
    return;
  }

  // Lee el archivo solicitado y responde con su contenido
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Archivo no encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('Error del servidor');
      }
    } else {
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      switch (ext) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpeg';
          break;
      }

      console.log('Sirviendo archivo:', filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});