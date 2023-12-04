#!/usr/bin/env node

const yargs = require('yargs');

yargs
  .command({
    command: 'hola',
    describe: 'Saluda al usuario',
    handler: () => {
      console.log('¡Hola! Bienvenido a mi CLI. zhaira');
    }
  })
  .help()
  .argv;


// module.exports = () => {
//   // ...
// };


