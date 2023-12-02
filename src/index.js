import { convertPath, mdLinks, readMarkdownRender } from './functions.js';

const route = './readme.md'; 
const pathAbs = convertPath(route); //

readMarkdownRender(pathAbs)
    .then((html) => {
        mdLinks(html)
            .then(result => console.log(result))
            .catch(err => console.error(err));

    })
    .catch((error) => {
        console.error('Error:', error);
    });


