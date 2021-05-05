import http from "http";
import url from "url";
import { readFile, readdir } from "node:fs";

function makeContents(title, contents, description) {
  let contentList = "";
  contents.forEach((con) => {
    contentList = contentList + `<li><a href="/?id=${con}">${con}</a></li>`;
  });
  const template = `<!doctype html>
<html>
<head>
  <title>WEB2 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  <ul>
    ${contentList}
  </ul>
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
    readdir("./data", (err, contents) => {
      if (err) throw err;

      if (queryData.id === undefined) {
        const title = "Welcome";
        const description = "Hello! Node.js";

        response.writeHead(200);
        response.end(makeContents(title, contents, description));
      } else {
        const title = queryData.id;
        readFile(`data/${title}`, "utf-8", (err, description) => {
          if (err) throw err;

          response.writeHead(200);
          response.end(makeContents(title, contents, description));
        });
      }
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(3000);
