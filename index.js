import http from "node:http";
const PORT = 8000;

const server = http.createServer((req, res) => {
  const writeWithDelay = async () => {
    for (let counter = 1; counter < 10; counter++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      res.write("heartbeat\n");
    }
    // End the response after the loop completes
    res.end("a basic server");
  };
  writeWithDelay();
});

server.listen(PORT, () => console.log("Server running on port:" + PORT));
