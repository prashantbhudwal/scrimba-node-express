export const routes = {
    'GET /': function (req, res) {
        res.end('Root Route HIT');
    },
    'GET /hello': function (req, res) {
        res.end('hello world');
    },
};
