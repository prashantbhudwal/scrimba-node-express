import http from "node:http";
import { getData } from "./data.js";
const PORT = 8000;

const server = http.createServer(async (req, res) => {
  console.log(req.url); // which url the request hits
  if (req.url === "/") {
    const writeWithDelay = async () => {
      for (let counter = 1; counter < 10; counter++) {
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        res.write("heartbeat\n");
      }
      // End the response after the loop completes
      res.end("a basic server");
    };
    writeWithDelay();
  }

  if (req.url === "/api" && req.method === "GET") {
    const destinations = await getData();
    res.end(JSON.stringify(destinations));
  }
});

server.listen(PORT, () => console.log("Server running on port:" + PORT));
