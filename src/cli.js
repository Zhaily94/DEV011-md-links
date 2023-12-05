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
    .then(result => console.log("Este es el MD \n", result))
    .catch(err => console.error("Este es el error", err))
    
} else {
    //
    console.log('no existe la ruta')
}
