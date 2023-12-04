import path from 'path';
import fs from 'fs';
import MarkdownIt from 'markdown-it';

// Crear una instancia de MarkdownIt
const md = new MarkdownIt();



export function validatePath(route) {
  
  // valida si la ruta es absoluta y regresa un true o un false segun sea el caso
  return path.isAbsolute(route);
}

export function convertPath(ruta) {
  return validatePath(ruta) ? ruta : path.resolve(ruta);
}


// leer un archivo Markdown desde la ruta especificada (absoluta) y renderizar su contenido a HTML
export function readMarkdownRender(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      // Aquí se verifica si hay algún error al leer el archivo y se rechaza la promesa
      if (err) {
        console.error('Error al leer el archivo:', err);
        reject(err);
        return;
      }
      //  convierte el contenido Markdown en HTML
      const html = md.render(data);
      resolve(html);
    });
  });
}

// export function mdLinks(path) {
//     return new Promise((resolve, reject) => {
//         if (path) {
//             // Divide el contenido en líneas
//             const lineas = path.split('\n');
//             const pattern = /href="([^"]*)"/g;
//             // comienza la iteracion de cada linea
//             const arrayLinks = lineas.reduce((links, linea) => {
//             // hace un match de cada linea para ver si encuentra coincidencia y los almacena en links encontrados
//                 const linksFound = linea.match(pattern);
//                 if (linksFound) {
//                     // los links encotrados los almacena en un array (matches)
//                     //Esto extrae el contenido que está entre las comillas dobles.
//                     links.push(...linksFound.map(match => match.split('"')[1]));
//                 }
//                 return links;
//             }, []);

//             Promise.all(arrayLinks)
//                 .then(result => resolve(result))
//                 .catch(err => reject(err));
//         } else {
//             reject('¡No hay archivo! :(');
//         }
//     });
// }
