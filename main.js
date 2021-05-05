import http from "http";
import url from "url";
import { readFile, readdir, writeFile, unlink } from "node:fs";
import qs from "querystring";

const template = {
  html: (url, title, contentList, description) => {
    const template = `<!doctype html>
<html>
<head>
  <title>WEB - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h2><a href="/">WEB2</a></h2>
  <ul>
    ${contentList}
  </ul>
  ${
    url === "/"
      ? title !== "Welcome"
        ? `<a href="/update?id=${title}">update</a>
        <form action="/delete_process" method="post" onsubmit="return confirm('삭제하시겠습니까?');">
        <input type="hidden" name="id" value="${title}" />
        <input type="submit" value="delete" />`
        : `<a href="/create">create</a>`
      : ``
  }
  
  <h2>${title}</h2>
  ${description}
</body>
</html>
`;
    return template;
  },
  list: (contents) => {
    let contentList = "";
    contents.forEach((con) => {
      contentList = contentList + `<li><a href="/?id=${con}">${con}</a></li>`;
    });

    return contentList;
  },
};

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
        response.end(
          template.html(pathName, title, template.list(contents), description),
        );
      } else {
        const title = queryData.id;
        readFile(`data/${title}`, "utf-8", (err, description) => {
          if (err) throw err;

          response.writeHead(200);
          response.end(
            template.html(
              pathName,
              title,
              template.list(contents),
              description,
            ),
          );
        });
      }
    });
  } else if (pathName === "/create") {
    readdir("./data", (err, contents) => {
      const title = "WEB - Create";

      response.writeHead(200);
      response.end(
        template.html(
          pathName,
          title,
          template.list(contents),
          `
      <form action="/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
      <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
      <input type="submit">
      </p>
      </form>
      `,
        ),
      );
    });
  } else if (pathName === "/create_process") {
    let body = "";
    request.on("data", (data) => {
      body += data;
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;

      writeFile(`data/${title}`, description, "utf-8", (err) => {
        if (err) throw err;
        console.log("The file has been saved!");

        response.writeHead(302, {
          Location: `/?id=${title}`,
        });
        response.end();
      });
    });
  } else if (pathName === "/update") {
    readFile(`data/${queryData.id}`, "utf-8", (err, data) => {
      if (err) throw err;
      const title = queryData.id;
      const descripion = data;

      response.writeHead(200);
      response.end(
        template.html(
          pathName,
          title,
          [],
          `<form action="/update_process" method="post">
      <p><input type="hidden" name="id" placeholder="title" value="${title}" ></p>
      <p><input type="text" name="title" placeholder="title" value="${title}" ></p>
      <p>
      <textarea name="description" placeholder="description">${descripion}</textarea>
      </p>
      <p>
      <input type="submit">
      </p>
      </form>`,
        ),
      );
    });
  } else if (pathName === "/update_process") {
    let body = "";
    request.on("data", (data) => {
      body += data;
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const id = post.id;
      const title = post.title;
      const description = post.description;

      if (id !== title) {
        rename(`data/${id}`, `data/${title}`, (err) => {
          if (err) throw err;
        });
      }

      writeFile(`data/${title}`, description, "utf-8", (err) => {
        if (err) throw err;
        console.log("The file has been saved!");

        response.writeHead(302, {
          Location: `/?id=${title}`,
        });
        response.end();
      });
    });
  } else if (pathName === "/delete_process") {
    let body = "";
    request.on("data", (data) => {
      body += data;
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const id = post.id;

      unlink(`data/${id}`, (err) => {
        if (err) throw err;
      });

      response.writeHead(302, {
        Location: "/",
      });
      response.end();
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(3000);
