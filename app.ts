import Server from './src/Server/Server';
import RepoHandler from './src/RepoHandler/RepoHandler';

const path = process.argv[2];
const repoHandler = new RepoHandler(path);
const server = new Server(repoHandler);

server.run();
