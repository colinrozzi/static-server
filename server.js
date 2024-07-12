const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const { method, url } = req;
  console.log(method, url);
  if (method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
  } else if (method === "POST" && url === "/") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      const { file, filename } = data;
      console.log(filename);
      fs.writeFile(`./static/${filename}`, file, (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500, {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify({ message: "Error" }));
        } else {
          res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify({ message: "Success" }));
        }
      });
    });
  } else if (method === "GET") {
    fs.readFile(`./static${url}`, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("Not found");
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });
  }
});

server.listen(3009);
