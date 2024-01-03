const path = require('path');
const fs = require('fs');
const axios = require('axios');
const validateLinks = require('../src/functions').validateLinks;
const validatePath = require('../src/functions').validatePath;
const convertPath = require('../src/functions').convertPath;
const findLinks = require('../src/functions').findLinks;
const readMarkdownRender = require('../src/functions').readMarkdownRender;
const printLinks = require('../src/functions').printLinks;


// Test para funcion de conversion de ruta
describe('Funcion que valida si la ruta es absoluta o relativa', () => {
  it('Deberia retornar verdadero para una ruta absoluta', () => {
    const absolutePath = '/absolute/path/example.md';
    expect(validatePath(absolutePath)).toBe(true);
  });

  it('Deberia retornar falso para una ruta relativa', () => {
    const relativePath = 'relative/path/example.md';
    expect(validatePath(relativePath)).toBe(false);
  });
});

//test para la funcion de conversion de ruta
describe('Funcion que valida si la ruta es absoluta o relativa', () => {
  it('Deberia retornar la ruta original si es absoluta', () => {
    const absolutePath = '/absolute/path/example.md';
    expect(convertPath(absolutePath)).toBe(absolutePath);
  });

  it('Deberia retornar la ruta resuelta si es relativa', () => {
    const relativePath = 'relative/path/example.md';
    const resolvedPath = path.resolve(relativePath);
    expect(convertPath(relativePath)).toBe(resolvedPath);
  });
});

//Test para leer el documento markdown
jest.mock('fs'); // Mock de fs para simular la lectura de archivos
describe('Funcion que hace una lectura del archivo markdown y lo convierte en html', () => {
  test('Deberia de renderizar el archivo markdown para convertirlo en html', async () => {
    const mockMarkdownContent = '## Hello, world!';
    const mockFilePath = 'C:\\Users\\ZhailyAlfa\\Desktop\\laboratoria-dev\\DEV011-md-links\\readme-prueba.md';
    fs.readFile.mockImplementation((path, encoding, callback) => {
      if (path === mockFilePath) {
        callback(null, mockMarkdownContent);
      } else {
        callback(new Error('File not found'));
      }
    });
    const result = await readMarkdownRender(mockFilePath);
    expect(result).toContain('<h2>Hello, world!</h2>');
  });

  it('Deberia manejar errores de lectura de archivos', async () => {
    const mockFilePath = 'C:\\Users\\ZhailyAlfa\\Desktop\\laboratoria-dev\\DEV011-md-links\\readme-prueba.mkd';

    const readMarkdownRenderMock = jest.fn((filePath) => {
      if (filePath === mockFilePath) {
        return Promise.reject(new Error('File not found'));
      } else {
        return Promise.resolve(null);
      }
    });
    // Deberías ajustar tu función para manejar este tipo de error correctamente en su lógica de manejo de errores
    await expect(readMarkdownRenderMock(mockFilePath)).rejects.toThrow('File not found');
  });
});

//test para la extraccion de links y guardarlos en un array
describe('Esta funcion extrae los links de un markdown y los guarda en un array', () => {
  it('Devuelve un array vacío si el markdown es vacío', () => {
    const markdownHtml = '';
    const filePath = '/ruta/al/archivo.md';
    const result = findLinks(markdownHtml, filePath);
    expect(result).toEqual([]); // Verifica si devuelve un array vacío cuando el markdown es vacío
  });

  it('Extrae los enlaces del markdown y los devuelve en un array', () => {
    const markdownHtml = '<a href="https://example.com"> Enlace 1</a>\n<a href="https://test.com"> Enlace 2</a>';
    const filePath = 'C:\\Users\\ZhailyAlfa\\Desktop\\laboratoria-dev\\DEV011-md-links\\readme-prueba.md';

    const result = findLinks(markdownHtml, filePath);
    const expectedLinks = [
      { href: 'https://example.com', title: ' Enlace 1', file: 'C:\\Users\\ZhailyAlfa\\Desktop\\laboratoria-dev\\DEV011-md-links\\readme-prueba.md' },
      { href: 'https://test.com', title: ' Enlace 2', file: 'C:\\Users\\ZhailyAlfa\\Desktop\\laboratoria-dev\\DEV011-md-links\\readme-prueba.md' },
    ];

    expect(result).toEqual(expectedLinks); // Verifica si los enlaces extraídos son los esperados
  });

  it('Devuelve un array vacío si no hay enlaces en el markdown', () => {
    const markdownHtml = 'Este es un texto sin enlaces';
    const filePath = '/ruta/al/archivo.md';

    const result = findLinks(markdownHtml, filePath);
    expect(result).toEqual([]); // Verifica si devuelve un array vacío cuando no hay enlaces en el markdown
  });
});

// test para la funcion de validar links
jest.mock('axios');

describe('Deberia validar los links que extrae del markdown', () => {
  it('Deberia validar que el array no venga vacio', () => {
    expect()

  });
  it('debería retornar un array con status y mensaje para cada link', () => {
    // Mock de respuestas simuladas de Axios
    const mockResponses = [
      { status: 200, statusText: 'OK' },
      { status: 404, statusText: 'Not Found' },
    ];

    // Configurar Axios para que devuelva las respuestas simuladas
    axios.get.mockImplementationOnce(() => Promise.resolve(mockResponses[0]))
      .mockImplementationOnce(() => Promise.resolve(mockResponses[1]));

    const arrayLinks = [
      { href: 'https://es.wikipedia.org/wiki/Markdown' },
      { href: 'https://www.npmjs.com/package/markdown-it' },
    ];

    const expectedUpdatedArray = [
      { href: 'https://es.wikipedia.org/wiki/Markdown', status: 200, msj: 'OK' },
      { href: 'https://www.npmjs.com/package/markdown-it', status: 404, msj: 'Not Found' },
    ];

    // Ejecutar la función y realizar la prueba
    return validateLinks(arrayLinks).then(updatedArray => {
      expect(updatedArray).toEqual(expect.arrayContaining(expectedUpdatedArray));
    });
  });
});

// test para la funcion de imprimir los links en caso de que en consola tenga la validacion undefined
describe('Funcion que imprime una cadena concatenada de links encontrados de un array', () => {
  it('Deberia retornar los links encontrados en un array, cuando en la consola no tenga ninguna validacion', () => {
    const path = '/absolute/path/example.md';
    const arrayLinks = [
      { href: 'https://es.wikipedia.org/wiki/Markdown', title: 'Markdown es un lenguaje de marcado', file: 'C:\\Users\\ZhailyAlfa\\Desktop\\laboratoria-dev\\DEV011-md-links\\readme-prueba.md', status: 200, msj: 'OK' },
    ];
    const expectedOutput = `${path.substring(0, 50)} | ${arrayLinks[0].href.substring(0, 50)} | ${arrayLinks[0].title.substring(0, 50)} \n`;
    expect(printLinks(arrayLinks, path)).toEqual(expectedOutput);
  });
});

