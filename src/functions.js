import path from 'path';
import fs from 'fs';
import MarkdownIt from 'markdown-it';

// Crear una instancia de MarkdownIt
const md = new MarkdownIt();

export function convertPath(route) {
    // convierte la ruta en datos en bruto para que entre a la funcion
    const ruta = String.raw`${route}`;
    // valida si la ruta es absoluta y regresa un true o un false segun sea el caso
    const rutaAbsoluta = path.isAbsolute(ruta);
    if (!rutaAbsoluta) {
        const rutaAbs = path.resolve(ruta);
        console.log('Esta es una ruta convertida a absoluta:', rutaAbs);
        return rutaAbs;
    } else {
        console.log('La ruta ya es absoluta: ');
        return ruta;
    }
}

// leer un archivo Markdown desde la ruta especificada (absoluta) y renderizar su contenido a HTML
export function readMarkdownRender(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            // Aquí se verifica si hay algún error al leer el archivo y se rechaza la promesa 
            if (err) {
                console.error('Error al leer el archivo:', err);
                reject(err);
                return;
            }
            //  convierte el contenido Markdown en HTML
            const html = md.render(data);
            resolve(html);
        });
    });
}


export function mdLinks(path) {
    return new Promise((resolve, reject) => {
        if (path) {
            // Divide el contenido en líneas
            const lineas = path.split('\n');
            const pattern = /href="([^"]*)"/g;
            // comienza la iteracion de cada linea 
            const arrayLinks = lineas.reduce((links, linea) => {
            // hace un match de cada linea para ver si encuentra coincidencia y los almacena en links encontrados
                const linksFound = linea.match(pattern);
                if (linksFound) {
                    // los links encotrados los almacena en un array (matches)
                    //Esto extrae el contenido que está entre las comillas dobles.
                    links.push(...linksFound.map(match => match.split('"')[1]));
                }
                return links;
            }, []);

            Promise.all(arrayLinks)
                .then(result => resolve(result))
                .catch(err => reject(err));
        } else {
            reject('¡No hay archivo! :(');
        }
    });
}
