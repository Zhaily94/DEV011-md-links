
// version commonJs
const { convertPath, readMarkdownRender, findLinks } = require('./functions.js');

function mdLinks(path) {
  return new Promise((resolve, reject) => {
    const rutaConvertida = convertPath(path);
    readMarkdownRender(rutaConvertida)
      .then((html) => {
        const linksExtraidos = findLinks(html, rutaConvertida);
        resolve(linksExtraidos);
      })
      .catch((error) => {
        // Manejar el error
        console.error('Error al leer el markdown:', error);
        reject(error);
      });
  });
}

module.exports = { mdLinks };

