import http from "http";
import fs from "fs";

import path from "path";
const __dirname = path.resolve();

const app = http.createServer(function (request, response) {
  let url = request.url;
  if (request.url === "/") {
    url = "/index.html";
  }
  if (request.url === "/favicon.ico") {
    return response.writeHead(404);
  }

  response.writeHead(200);

  console.log(__dirname + url);
  response.end(fs.readFileSync(__dirname + url));
});

app.listen(3000);