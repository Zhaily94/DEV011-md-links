
// version commonJs
const { convertPath, readMarkdownRender, findLinks, validateLinks, printLinks } = require('./functions.js');

function mdLinks(path, validate) {

  const rutaConvertida = convertPath(path);
  const promiseArrayLinks = new Promise((resolve, reject) => {
    readMarkdownRender(rutaConvertida)
      .then((html) => {
        const linksExtraidos = findLinks(html, rutaConvertida);
        resolve(linksExtraidos);
      })
      .catch((error) => {
        console.error('Error al leer el markdown:', error);
        reject(error);
      });
  });

  switch (validate) {
    case 'true':
      return promiseArrayLinks.then((array) => {
        const arrayValidate = validateLinks(array);
        return arrayValidate;
      }).catch((error) => {
        console.error('Error al validar los links:', error);
        throw error;
      });
    case 'false':
      return promiseArrayLinks.catch((error) => {
        console.error('Error al leer el markdown:', error);
        throw error;
      });
    case undefined:
      return promiseArrayLinks.then((array) => {
        const arrayValidate = printLinks(array, path);
        return arrayValidate;
      }).catch((error) => {
        console.error('Error al validar los links:', error);
        throw error;
      });
    default:
      // Acción por defecto si no coincide ningún caso
  }
}

module.exports = { mdLinks };

