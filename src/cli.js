#!/usr/bin/env node

const yargs = require('yargs');

yargs
  .command({
    command: 'saludar',
    describe: 'Saluda al usuario',
    handler: () => {
      console.log('¡Hola! Bienvenido a mi CLI.');
    }
  })
  .help()
  .argv;
