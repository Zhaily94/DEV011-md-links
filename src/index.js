import { convertPath, readMarkdownRender} from './functions.js';

export function mdLinks(path) {
  return new Promise((resolve, reject) => {
    const rutaConvertida = convertPath(path);
    readMarkdownRender(rutaConvertida)
    .then((html) => {
      resolve(html);
    })
    .catch((error) => {
      // Manejar el error
      console.error('Error al leer el markdown:', error);
      reject(error)
    });
  });
}




// export function mdLinks(path) {
//   return new Promise((resolve, reject) => {
//     // Convertir la ruta proporcionada
//     const rutaConvertida = convertPath(path);
    
//     // Leer y renderizar el archivo Markdown
//     readMarkdownRender(rutaConvertida)
//       .then(mdContent => {
//         // Encontrar enlaces en el contenido del archivo Markdown
//         const arrayLinks = foundLinks(mdContent);

//         // Resolver la promesa principal con el contenido Markdown y los enlaces encontrados
//         resolve({ mdContent, arrayLinks });
//       })
//       .catch(error => {
//         // Manejar cualquier error que ocurra durante la lectura o procesamiento del archivo
//         reject(error);
//       });
//   });
// }
