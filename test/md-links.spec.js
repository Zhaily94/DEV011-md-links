const path = require('path');
const fs = require('fs');
const axios = require('axios');
const validateLinks = require('../src/functions').validateLinks;
const validatePath = require('../src/functions').validatePath;
const convertPath = require('../src/functions').convertPath;
const findLinks = require('../src/functions').findLinks;
const readMarkdownRender = require('../src/functions').readMarkdownRender;
const printLinks = require('../src/functions').printLinks;
const validation = require('../src/functions').validation;
const stats = require('../src/functions').stats;
const validateStats = require('../src/functions').validateStats;


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

// //Test para leer el documento markdown
jest.mock('fs');
describe('Función que convierte un archivo Markdown en HTML', () => {
  const mockMarkdownContent = '## Hello, world!';
  const mockFilePath = 'C:\\Users\\ZhailyAlfa\\Desktop\\laboratoria-dev\\DEV011-md-links\\readme-prueba.md';

  test('Renderiza el archivo Markdown a HTML', async () => {
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

  test('Maneja errores de lectura de archivos', async () => {
    const nonExistentFilePath = 'C:\\Users\\ZhailyAlfa\\Desktop\\laboratoria-dev\\DEV011-md-links\\readme-prueba.mkd';

    fs.readFile.mockImplementation((path, encoding, callback) => {
      if (path === nonExistentFilePath) {
        callback(new Error('File not found'));
      } else {
        callback(null, '');
      }
    });

    await expect(readMarkdownRender(nonExistentFilePath)).rejects.toThrow('File not found');
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
describe('validateLinks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate links and return updated array with statuses', async () => {
    const mockLinks = [
      { href: 'https://example.com/page1' },
      { href: 'https://example.com/page2' },
    ];

    const mockResponses = [
      { status: 200, statusText: 'OK' },
      { status: 404 },
    ];

    axios.get.mockImplementationOnce(() => Promise.resolve(mockResponses[0]));
    axios.get.mockImplementationOnce(() => Promise.reject({ response: { status: 404 } }));

    const result = await validateLinks(mockLinks);

    expect(result).toEqual([
      { href: 'https://example.com/page1', status: 200, msj: 'OK' },
      { href: 'https://example.com/page2', status: 404, msj: 'fail' },
    ]);
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledWith('https://example.com/page1');
    expect(axios.get).toHaveBeenCalledWith('https://example.com/page2');
  });

  it('should handle empty array and return empty array', async () => {
    const result = await validateLinks([]);

    expect(result).toEqual([]);
    expect(axios.get).not.toHaveBeenCalled();
  });
});


// test para la funcion de imprimir los links en caso de que en consola tenga la validacion undefined
describe('Funcion que imprime una cadena concatenada de links encontrados de un array', () => {
  it('Deberia retornar los links encontrados en un array, cuando en la consola no tenga ninguna validacion', () => {
    const path = '/absolute/path/example.md';
    const arrayLinks = [
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        title: 'Markdown es un lenguaje de marcado',
        file: 'C:\\Users\\ZhailyAlfa\\Desktop\\laboratoria-dev\\DEV011-md-links\\readme-prueba.md',
        status: 200,
        msj: 'OK'
      },
    ];
    const expectedOutput = `${path.substring(0, 50)} | ${arrayLinks[0].href.substring(0, 50)} | ${arrayLinks[0].title.substring(0, 50)} \n`;
    expect(printLinks(arrayLinks, path)).toEqual(expectedOutput);
  });
  it('Debería devolver una cadena vacía para una matriz vacía', () => {
    const emptyArray = [];

    const result = validation(emptyArray);

    // Verifica que la respuesta para un array vacío sea una cadena vacía
    expect(result).toEqual('');
  });
});

// test para la funcion que permite imprimir ciertos datos de un array como es el file, el link, msj, status y titulo
describe('Funcion que imprime informacion de una cadena de links validados de un array limitado a 50 caracteres', () => {
  it('Deberia mostrar una cadena con los links y su informacion', () => {
    const arrayLinks = [
      {
        href: 'https://es.wikipedia.org/wiki/Markdown',
        title: 'Markdown es un lenguaje de marcado',
        file: 'C:\\Users\\ZhailyAlfa\\Desktop\\laboratoria-dev\\DEV011-md-links\\readme-prueba.md',
        status: 200,
        msj: 'OK'
      },
    ];
    const expectedOutput = `${arrayLinks[0].file.substring(0, 50)} | ${arrayLinks[0].href.substring(0, 50)} | ${arrayLinks[0].msj} | ${arrayLinks[0].status} | ${arrayLinks[0].title.substring(0, 50)} \n`;
    expect(validation(arrayLinks)).toEqual(expectedOutput);
  });

  it('Debería devolver una cadena vacía para una matriz vacía', () => {
    const emptyArray = [];

    const result = validation(emptyArray);

    // Verifica que la respuesta para un array vacío sea una cadena vacía
    expect(result).toEqual('');
  });

});

//test para la funcion de stats
describe('Funcion de stats', () => {
  test('Deberia retornar los links encontrados en un markdown y mostrar cuantos links tienen estado 200', () => {
    const links = [
      { href: 'https://example.com', status: 200 },
      { href: 'https://test.com', status: 404 },
      { href: 'https://test.com', status: 200 },
      { href: 'https://jest.com', status: 200 },
    ];

    const result = stats(links);

    // Verifica que la respuesta tenga el formato esperado
    expect(result).toContain('Total: 4');
    expect(result).toContain('Unique: 3');
  });

  test('Debería devolver cero para una matriz vacía', () => {
    const emptyArray = [];

    const result = stats(emptyArray);

    // Verifica que la respuesta para un array vacío sea la esperada
    expect(result).toBe('Total: 0\nUnique: 0');
  });
});


//test para la funcion de validateStats
describe('Funcion que valida los links y muestra el estado de los mismos', () => {
  it('Deberia de retornar los estados de los links encontrados', () => {
    const arrayLinks = [
      { href: 'https://example.com', status: 200 },
      { href: 'https://test.com', status: 404 },
      { href: 'https://example.com', status: 200 },
      { href: 'https://jest.com', status: 403 },
    ];

    const result = validateStats(arrayLinks);

    // Verifica que la respuesta tenga el formato y valores esperados
    expect(result).toEqual('Total: 4\nUnique: 2\nBroken: 2');
  });

  it('Debería devolver cero estadísticas para una matriz vacía', () => {
    const emptyArray = [];

    const result = validateStats(emptyArray);

    // Verifica que la respuesta para un array vacío sea la esperada
    expect(result).toEqual('Total: 0\nUnique: 0\nBroken: 0');
  });

  it('Debería imprimir que todos los enlaces estén bien', () => {
    const allOkLinks = [
      { href: 'https://example.com', status: 200 },
      { href: 'https://test.com', status: 200 },
    ];

    const result = validateStats(allOkLinks);

    // Verifica que la respuesta para todos los enlaces esté OK
    expect(result).toEqual('Total: 2\nUnique: 2\nBroken: 0');
  });

  it('Debería imprimir que todos los enlaces rotos', () => {
    const allBrokenLinks = [
      { href: 'https://example.com', status: 404 },
      { href: 'https://test.com', status: 405 },
    ];

    const result = validateStats(allBrokenLinks);

    // Verifica que la respuesta para todos los enlaces esté rota
    expect(result).toEqual('Total: 2\nUnique: 0\nBroken: 2');
  });
});
