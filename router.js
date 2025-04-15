export const routes = {
  "GET /": async function (req, res) {
    res.end("Root Route HIT");
  },
  "GET /hello": async function (req, res) {
    res.end("hello world");
  },
};
