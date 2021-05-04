import http from "http";
import fs from "fs";
import url from "url";

import path from "path";
const __dirname = path.resolve();

const app = http.createServer(function (request, response) {
  let _url = request.url;
  const queryData = url.parse(_url, true).query;
  const title = queryData.id !== undefined ? queryData.id : "Welcome";
  if (_url === "/favicon.ico") {
    return response.writeHead(404);
  }

  response.writeHead(200);

  let template = `<!doctype html>
<html>
<head>
  <title>WEB2 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  <ol>
    <li><a href="/?id=HTML">HTML</a></li>
    <li><a href="/?id=CSS">CSS</a></li>
    <li><a href="/?id=JavsScript">JavaScript</a></li>
  </ol>
  <h2>${title}</h2>
</body>
</html>
`;

  response.end(template);
});

app.listen(3000);
