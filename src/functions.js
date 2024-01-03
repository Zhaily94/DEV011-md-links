const path = require('path');
const fs = require('fs');
const MarkdownIt = require('markdown-it');
const axios = require('axios');

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

//Funcion para validar los links 
//se crea un nuevo array con .map para guardar el estado y el mensaje de los links 
function validateLinks(arrayLinks) {
  if (arrayLinks) {
    const arrayEdit = arrayLinks.map((obj) => { // se itera cada objeto del array
      // se llama la funcion de axios donde se le manda cada href de cada objeto
      return axios.get(obj.href)
        .then((response) => {
          // se crea un elemento status y se le asigna el la propiedad dada de la funcion axios
          obj.status = response.status;
          obj.msj = response.statusText;
          return obj; // Importante devolver el objeto modificado
        })
        .catch((err) => {
          obj.status = !err.response ? 404 : err.response.status;
          obj.msj = 'fail';
          return obj; // Importante devolver el objeto modificado
        });
    });

    return Promise.all(arrayEdit)
      .then((updatedArray) => {
        return updatedArray; // Devolver el array actualizado después de que todas las promesas se resuelvan
      })
      .catch((error) => {
        console.error('Error en las solicitudes HTTP:', error);
        throw error;
      });
  }
}

function printLinks(arrayLinks, path) {
  let concatenados = '';
  arrayLinks.forEach(link => {  
    const file = path  ? path.substring(0, 50) : ''; 
    const href = link.href ? link.href.substring(0, 50) : ''; 
    const title = link.title ? link.title.substring(0, 50) : ''; 
    concatenados += `${file} | ${href} | ${title} \n`;
  });
  return concatenados
}

function validation(arrayLinks) {
  let concatenados = '';
  arrayLinks.forEach(link => {
    //  const file = path.substring(0,50);
    const file = link.file.substring(0, 50);
    const href = link.href.substring(0, 50);
    const msj = link.msj;
    const status = link.status;
    const title = link.title.substring(0, 50);
    // concatenados += `${file} | ${href} | ${msj} | ${status} | ${title} \n`;
    concatenados = concatenados.concat(file, ' | ', href, ' | ', msj, ' | ', status, ' | ', title, '\n');
  });
  return concatenados
}

function stats(arrayLinks) {
  let count = 0;
  let countState = 0;
  let respuesta = '';
arrayLinks.forEach(link => {
  if(link.href){
    count++
  }
  if(link.status == 200){
    countState++
  }
});
respuesta = respuesta.concat( 'Total: ', count, '\n' , 'Unique: ', countState);
  return respuesta
}

function validateStats(arrayLinks) {
  let count = 0;
  let countState = 0;
  let countBroken = 0;
  let respuesta = '';
arrayLinks.forEach(link => {
  if(link.href){
    count++
  }
  if(link.status == 200){
    countState++
  }
  if(link.status >= 400 && link.status <= 405){
    countBroken++
  }
});
respuesta = respuesta.concat('Total: ', count, '\n' , 'Unique: ', countState, '\n', 'Broken: ', countBroken);
  return respuesta
}

module.exports = {
  validatePath,
  convertPath,
  readMarkdownRender,
  findLinks,
  validateLinks,
  printLinks,
  validation,
  stats,
  validateStats,
};


