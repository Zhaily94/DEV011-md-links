
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

    if (validate === 'true') {
    return promiseArrayLinks.then((array) => {
      const arrayValidate = validateLinks(array);
      return arrayValidate;
    }).catch((error) => {
      console.error('Error al validar los links:', error);
      throw error;
    });
  } else if (validate === 'false'){
    return promiseArrayLinks.catch((error) => {
      console.error('Error al leer el markdown:', error);
      throw error;
    });
  } else if (validate === undefined){
    return promiseArrayLinks.then((array) => {
      const arrayValidate = printLinks(array, path);
      return arrayValidate;
    }).catch((error) => {
      console.error('Error al validar los links:', error);
      throw error;
    });




    // reject(new Error('Error'));
  
  }
}

module.exports = { mdLinks };

