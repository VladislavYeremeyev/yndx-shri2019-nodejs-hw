const Server = require('./src/Server/Server');
const RepoHandler = require('./src/RepoHandler/RepoHandler');

const path = process.argv[2];
const repoHandler = new RepoHandler(path);
const server = new Server(repoHandler);

server.run();
