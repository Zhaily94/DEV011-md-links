import { convertPath } from './functions.js';

// readMarkdownRender(pathAbs)
//     .then((html) => {
//         mdLinks(html)
//             .then(result => console.log(result))
//             .catch(err => console.error(err));

//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });

export function mdLinks(path) {
  return new Promise((resolve, reject) => {
    const rutaConvertida = convertPath(path);

    resolve(rutaConvertida);

    // const pathAbs = convertPath(route);
  });
}
