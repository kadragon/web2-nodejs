import http from "http";
import url from "url";
import { readFile } from "node:fs";

function makeContents(title, description) {
  const template = `<!doctype html>
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
  ${description}
</body>
</html>
`;
  return template;
}

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathName = url.parse(_url, true).pathname;

  if (_url === "/favicon.ico") {
    return response.writeHead(404);
  }

  if (pathName === "/") {
    if (queryData.id === undefined) {
      const title = "Welcome";
      const description = "Hello! Node.js";

      response.writeHead(200);
      response.end(makeContents(title, description));
    } else {
      const title = queryData.id;
      readFile(`data/${title}`, "utf-8", (err, description) => {
        if (err) throw err;

        response.writeHead(200);
        response.end(makeContents(title, description));
      });
    }
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(3000);
