var nodemon = require('nodemon');
nodemon({ script: 'server.js' }).on('end', function () {
  console.log('script crashed for some reason');
}).on('start', function () {
  console.log('nodemon start ho gya ');
})

// nodemon.emit('start');
