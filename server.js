const http = require('http');
const static = require('static');

const hostname = '127.0.0.1';
const port = 3000;

const file = new static.Server('./public');
http.createServer((req, res) => {
  file.serve(req, res);
  console.log(`Static server is running at http://${hostname}:${port}/`);
}).listen(3000);


// const server = http.createServer((request, response) => {
//   response.statusCode = 200;
//   response.setHeader('Content-Type', 'text/html');
//   response.end('<h1>Hello, World!</h1>');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server is running at http://${hostname}:${port}/`);
// });