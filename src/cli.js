// #!/usr/bin/env node
import process from 'process';
import fs from 'fs';
import { mdLinks } from "./index.js";


// guarda la ruta escrita en consola
const path = process.argv[2];
//Comprueba que la ruta existe en el computador
const validateLinksUser = fs.existsSync(path);
const markdownExtensions = /\.(md|mkd|mdwn|mdown|mdtxt|mdtext|markdown|text)$/i;
const validateTypeMD = markdownExtensions.test(path);

if (validateLinksUser && validateTypeMD) {
    //
    mdLinks(path)
    .then(result => console.log("Esta es la ruta", result))
    .catch(err => console.error("Este es el error", err))
    
} else {
    //
    console.log('no existe la ruta')
}


// const route = 'C:/Users/ZhailyAlfa/Desktop/laboratoria-dev/DEV011-md-links/README.md'; 


// const yargs = require('yargs');

// yargs
//   .command({
//     command: 'saludar',
//     describe: 'Saluda al usuario',
//     handler: () => {
//       console.log('¡Hola! Bienvenido a mi CLI.');
//     }
//   })
//   .help()
//   .argv;


