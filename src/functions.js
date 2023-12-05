import path from 'path';
import fs from 'fs';
// import marked from 'marked';
import MarkdownIt from 'markdown-it';

// Crear una instancia de MarkdownIt
const md = new MarkdownIt();


// valida si la ruta es absoluta y regresa un true o un false segun sea el caso
export function validatePath(route) {
  return path.isAbsolute(route);
}
// convierte la ruta en absoluta
export function convertPath(ruta) {
  return validatePath(ruta) ? ruta : path.resolve(ruta);
}

// leer un archivo Markdown desde la ruta especificada (absoluta) y renderizar su contenido a HTML
export function readMarkdownRender(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
  .then((data) => {
    // convierte el contenido Markdown en HTML
    const html = md.render(data);
    return html
  });
}
