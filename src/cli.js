#!/usr/bin/env node
// //version commonJs
const process = require('process');
const fs = require('fs');
const { mdLinks } = require("./index.js");

// guarda la ruta escrita en consola
const path = process.argv[2]
// guarda la validacion
let validate = process.argv[3]
let stats = process.argv[4]
// validate = validate.trim();



// Comprueba que la ruta existe en el computador
const validateLinksUser = fs.existsSync(path);
const markdownExtensions = /\.(md|mkd|mdwn|mdown|mdtxt|mdtext|markdown|text)$/i;
// Comprueba que extension sea valida
const validateTypeMD = markdownExtensions.test(path);

if (validateLinksUser && validateTypeMD) {
    mdLinks(path, validate, stats)
    .then(result => console.log("Este es el MD \n", result))
    .catch(err => console.error("Este es el error", err))
} else {
    console.log('no existe la ruta o no es un archivo Markdown');
}


//crear una constante que guarde un valor dado por el usuario y que sea true o false
//crear una sentencia que diga que si el valor es true que muestre al array modificado
// si es falso entonces que muestre el array sin cambios

