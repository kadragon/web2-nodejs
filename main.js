import http from "http";
import fs from "fs";
import url from "url";
import { readFile } from "node:fs";

const app = http.createServer(function (request, response) {
  let _url = request.url;

  if (_url === "/favicon.ico") {
    return response.writeHead(404);
  }

  const queryData = url.parse(_url, true).query;
  const title = queryData.id !== undefined ? queryData.id : "Welcome";

  readFile(`data/${title}`, "utf-8", (err, data) => {
    if (err) throw err;
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
    <li><a href="/?id=JavaScript">JavaScript</a></li>
  </ol>
  <h2>${title}</h2>
  ${data}
</body>
</html>
`;

    response.end(template);
  });
});

app.listen(3000);
