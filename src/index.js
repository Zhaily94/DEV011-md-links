
// version commonJs
const { convertPath, readMarkdownRender, findLinks, validateLinks, printLinks, validation, stats, validateStats} = require('./functions.js');

function mdLinks(path, validate, wordStats) {

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
if (wordStats == undefined){
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
    case '--validate':
      return promiseArrayLinks.then((array) => {
        return validateLinks(array)
        .then((updatedArray) =>{
          const validate = validation(updatedArray);
          return validate;
        }).catch((error) => {
        console.error('Error al validar los links:', error);
        throw error;
      });
    });
    case '--stats':
      return promiseArrayLinks.then((array) => {
        return validateLinks(array)
        .then((updatedArray) =>{
          const validate = stats(updatedArray);
          return validate;
        }).catch((error) => {
        console.error('Error al validar los links:', error);
        throw error;
      });
    });
    default:
      // Acción por defecto si no coincide ningún caso
  }
}
  if (validate == '--validate' && wordStats == '--stats'){
    return promiseArrayLinks.then((array) => {
      return validateLinks(array)
      .then((updatedArray) =>{
        const validate = validateStats(updatedArray);
        return validate;
      }).catch((error) => {
      console.error('Error al validar los links:', error);
      throw error;
    });
  });
  }
}

module.exports = { mdLinks };

