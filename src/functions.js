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

//mandarle el archivo md a la funcion
// poner una condicional
// valiadr que no este vacio o que si exista
// del archivo dado modificarlo para que lo separe por lineas
//guardarlo en una variable 
// crear un patron para los href
// recorrer el docuemnto 
// comparar cada linea con el patron
// si coincide guardarlo en un array

export function findLinks(markdownHtml, path) {
  
  const links = [];
  const hrefRegex = /https?:\/\/[^\s]+/g; // extrae links del md
  const deleteHtmlRegex = /<[^>]+>/g; // patron para extraer etiquetas html
 
  if(!markdownHtml){ //validacion de md vacio
    return links;
  }

  const lines = markdownHtml.split('\n');  // Dividir el texto en líneas
  lines.forEach((line) => { // recorre cada linea
    const href = line.match(hrefRegex); // hace match de la linea con la expresion de extraer links y los guarda en href
    const title = line.replace(deleteHtmlRegex, ''); // Elimina las etiquetas HTML solo nos trae el texto de cada enlace
    if (href && title) { // comprueba que existan href y titulo
      links.push( // guarda los elementos traidos en un array links
        {
          href: href[0].replace(/".*>/, ''),
          title: title,
          file: path
        }
      );
    }
  });
  return links;
}




