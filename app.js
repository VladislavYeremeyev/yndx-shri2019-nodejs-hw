// const express = require('express');
const Server = require('./src/Server/Server');
// const routes = require('./src/routes/routes');
const RepoHandler = require('./src/RepoHandler/RepoHandler');

// const app = express();
const path = process.argv[2];
// const port = 3000;
const repoHandler = new RepoHandler(path);
const server = new Server(repoHandler);

server.run();

// app.get('/users/:userId', function(req, res) {
// 	res.send(req.params);
// });

// app.use('/', routes);

// app.listen(port, () => console.log(`Server listening on port ${port}!`));
