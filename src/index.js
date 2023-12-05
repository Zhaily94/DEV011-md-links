import { convertPath, readMarkdownRender, findLinks} from './functions.js';

export function mdLinks(path) {
  return new Promise((resolve, reject) => {
    const rutaConvertida = convertPath(path);
    readMarkdownRender(rutaConvertida)
    .then((html) => {
      const linksExtraidos = findLinks(html, path)
      resolve(linksExtraidos);
    })
    .catch((error) => {
      // Manejar el error
      console.error('Error al leer el markdown:', error);
      reject(error)
    });
  });
}


