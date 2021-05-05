import { readdir } from "node:fs";

readdir("./data", (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    console.log(file);
  });
});
