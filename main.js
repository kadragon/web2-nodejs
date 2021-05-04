import http from "http";
import fs from "fs";
import url from "url";

import path from "path";
const __dirname = path.resolve();

const app = http.createServer(function (request, response) {
  let _url = request.url;
  const queryData = url.parse(_url, true).query;
  console.log(queryData);
  if (_url === "/") {
    _url = "/index.html";
  } else if (_url === "/favicon.ico") {
    return response.writeHead(404);
  }

  response.writeHead(200);
  // response.end(fs.readFileSync(__dirname + _url));
  response.end(queryData.query);
});

app.listen(3000);
