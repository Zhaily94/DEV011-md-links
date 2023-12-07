const path = require('path');
const fs = require('fs');
const MarkdownIt = require('markdown-it');

// Crear una instancia de MarkdownIt
const md = new MarkdownIt();

// valida si la ruta es absoluta y regresa un true o un false segun sea el caso
function validatePath(route) {
  return path.isAbsolute(route);
}
// convierte la ruta en absoluta
function convertPath(ruta) {
  return validatePath(ruta) ? ruta : path.resolve(ruta);
}

// leer un archivo Markdown desde la ruta especificada (absoluta) y renderizar su contenido a HTML
function readMarkdownRender(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const html = md.render(data);
        resolve(html);
      }
    });
  })
  .then((html) => {
    // No need to call md.render again, it already contains the HTML
    return html;
  });
}

function findLinks(markdownHtml, filePath) {
  const links = [];
  const hrefRegex = /https?:\/\/[^\s]+/g; // extrae links del md
  const deleteHtmlRegex = /<[^>]+>/g; // patron para extraer etiquetas html

  if (!markdownHtml) {
    return links; // validacion de md vacio
  }

  const lines = markdownHtml.split('\n'); // Dividir el texto en líneas
  lines.forEach((line) => {
    // recorre cada linea
    const href = line.match(hrefRegex); // hace match de la linea con la expresion de extraer links y los guarda en href
    const title = line.replace(deleteHtmlRegex, ''); // Elimina las etiquetas HTML solo nos trae el texto de cada enlace
    if (href && title) {
      // comprueba que existan href y titulo
      links.push({
        // guarda los elementos traidos en un array links
        href: href[0].replace(/".*>/, ''),
        title: title,
        file: filePath,
      });
    }
  });
  return links;
}

module.exports = {
  validatePath,
  convertPath,
  readMarkdownRender,
  findLinks,
};


