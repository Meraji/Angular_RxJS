const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const list = ['Homer', 'Barney'];

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  const firstname = req.body.firstname;
  if (req.method === 'PUT') {
    if (list.includes(firstname)) {
      res.sendStatus(409);
    }
  }
  if (req.method === 'PATCH') {
    res.sendStatus(401);
  } else next()
});

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
