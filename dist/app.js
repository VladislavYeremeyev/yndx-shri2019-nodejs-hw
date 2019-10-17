"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("./src/Server/Server"));
const RepoHandler_1 = __importDefault(require("./src/RepoHandler/RepoHandler"));
const path = process.argv[2];
const repoHandler = new RepoHandler_1.default(path);
const server = new Server_1.default(repoHandler);
server.run();
