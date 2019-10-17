"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const urlExists = require("url-exists");
class Server {
    constructor(repoHandler) {
        this.repoHandler = repoHandler;
        this.serverInstance = null;
        this.isTesting = false;
    }
    run() {
        const server = express_1.default();
        const cors = require("cors");
        const port = 3000;
        server.use(cors());
        server.use(body_parser_1.default.json());
        server.get("/", (req, res) => res.send("Hello World!"));
        server.get("/api/repos", (req, res) => {
            try {
                const repos = this.repoHandler.getRepos();
                res.json({ data: repos });
            }
            catch (err) {
                res.status(500).send({ message: `Error: ${err}` });
            }
        });
        server.get("/api/repos/:repositoryId/commits/:commitHash", (req, res) => {
            // if query is omitted
            // res.redirect(`/api/repos/${req.params.repositoryId}/commits/${req.params.commitHash}?display=10&page=1`);
            try {
                const process = this.repoHandler.getCommits(req.params.repositoryId, req.params.commitHash);
                let result = "";
                let withError = false;
                const keys = ["hash", "name", "date-timestamp"];
                process.stdout.on("data", function (data) {
                    result += data.toString();
                });
                process.on("error", function () {
                    withError = true;
                });
                process.on("close", function () {
                    if (result.length === 0 || withError) {
                        res
                            .status(404)
                            .json({ message: "branchName or commitHash does not exist" });
                    }
                    else {
                        let commits = result.trim().split("\n");
                        const displayAmount = req.query.display || 10;
                        const page = req.query.page || 1;
                        if (typeof req.query.display !== "undefined" ||
                            typeof req.query.page !== "undefined") {
                            if (!isNaN(+displayAmount) &&
                                +displayAmount > 0 &&
                                !isNaN(+page) &&
                                +page > 0 &&
                                +page <= Math.ceil(commits.length / displayAmount)) {
                                res.json({
                                    data: commits
                                        .filter((commit, i) => i > displayAmount * (page - 1) - 1 &&
                                        i < displayAmount * page)
                                        .map(elem => elem
                                        .split("|")
                                        .reduce((acc, val, i) => {
                                        acc[keys[i]] = val;
                                        return acc;
                                    }, {}))
                                });
                            }
                            else {
                                res.status(404).json({ message: "wrong query parameter" });
                            }
                        }
                        else {
                            res.json({
                                data: commits.map(elem => elem
                                    .split("|")
                                    .reduce((acc, val, i) => {
                                    acc[keys[i]] = val;
                                    return acc;
                                }, {}))
                            });
                        }
                    }
                });
            }
            catch (err) {
                console.log(err);
            }
        });
        server.get("/api/repos/:repositoryId/commits/:commitHash/diff", (req, res) => {
            try {
                const process = this.repoHandler.getCommitDiff(req.params.repositoryId, req.params.commitHash);
                let result = "";
                let withError = false;
                process.stdout.on("data", function (data) {
                    result += data.toString();
                });
                process.on("error", function () {
                    withError = true;
                });
                process.on("close", function () {
                    if (withError || result.length === 0) {
                        res.status(404).json({
                            message: "repoID, branchName or commitHash does not exist"
                        });
                    }
                    else {
                        res.json({
                            data: result
                        });
                    }
                });
            }
            catch (err) {
                console.log(err);
            }
        });
        server.get([
            "/api/repos/:repositoryId",
            "/api/repos/:repositoryId/tree/:commitHash?/:path([^/]*)?"
        ], (req, res) => {
            try {
                const process = this.repoHandler.getContent(req.params.repositoryId, req.params.commitHash, req.params.path);
                let result = "";
                let withError = false;
                process.stdout.on("data", function (data) {
                    result += data.toString();
                });
                process.on("error", function () {
                    withError = true;
                });
                process.on("close", function () {
                    if (withError || result.length === 0) {
                        res.status(404).json({
                            message: "Branch or directory is empty or not exists"
                        });
                    }
                    else {
                        res.json({
                            data: result.trim().split("\n")
                        });
                    }
                });
            }
            catch (err) {
                console.log(err);
            }
        });
        server.get("/api/repos/:repositoryId/blob/:commitHash/:pathToFile([^/]*)?", (req, res) => {
            try {
                const process = this.repoHandler.getFileContent(req.params.repositoryId, req.params.commitHash, req.params.pathToFile);
                const contentType = mime_types_1.default.contentType(path_1.default.extname(req.params.pathToFile));
                res.type(contentType.toString());
                let withError = false;
                // let result = '';
                // process.stdout.on('data', function(data) {
                // 	result += data.toString();
                // });
                // For optimizing memory for large files
                process.stdout.on("data", function (data) {
                    // res.write(data);
                    res.write(data.toString());
                });
                process.on("error", function () {
                    withError = true;
                });
                process.on("close", function () {
                    // if (result.length === 0) {
                    // 	res.status(404).json({
                    // 		message: 'File is empty or not exists'
                    // 	});
                    // }
                    if (withError) {
                        res.status(404);
                    }
                    res.end();
                });
                process.on("uncaughtException", (ex) => {
                    console.log(ex);
                    process.exit(1);
                });
            }
            catch (err) {
                console.log(err);
            }
        });
        server.get("/api-test/repos/:repositoryId/blob/:commitHash/:pathToFile([^/]*)?", (req, res) => {
            try {
                const process = this.repoHandler.getFileContent(req.params.repositoryId, req.params.commitHash, req.params.pathToFile);
                let result = "";
                let withError = false;
                process.stdout.on("data", function (data) {
                    result += data.toString();
                });
                process.on("error", function () {
                    withError = true;
                });
                process.on("close", function () {
                    if (withError || result.length === 0) {
                        res.status(404).json({
                            message: "File is empty or not exists"
                        });
                    }
                    else {
                        res.json({ data: result });
                    }
                });
                process.on("uncaughtException", (ex) => {
                    console.log(ex);
                    process.exit(1);
                });
            }
            catch (err) {
                console.log(err);
            }
        });
        server.delete("/api/repos/:repositoryId", (req, res) => {
            try {
                this.repoHandler.deleteRepo(req.params.repositoryId);
                res
                    .status(200)
                    .json({ message: `${req.params.repositoryId} is doesn't exist now` });
            }
            catch (err) {
                res.status(500).send({ message: `Error: ${err}` });
            }
        });
        server.post("/api/repos", (req, res) => {
            const { url } = req.body;
            urlExists(url, (error, exists) => {
                if (exists === true) {
                    try {
                        this.repoHandler.cloneRepo(url);
                        res.status(200).json({ message: "Repo cloned" });
                    }
                    catch (err) {
                        res.status(500).send({ message: `Error: ${err}` });
                    }
                }
                else {
                    res.status(404).send({ message: "Git file is not found" });
                }
            });
        });
        server.get("/api/repos/:repositoryId/letters", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const stream = this.repoHandler
                    .getLettersData();
                stream.on("data", function (el) {
                    if (typeof stream.result[el] !== "undefined") {
                        stream.result[el] += 1;
                    }
                    else {
                        stream.result[el] = 1;
                    }
                });
                stream.on("end", function () {
                    res.json(stream.result);
                });
            }
            catch (err) {
                console.log(err);
            }
        }));
        server.use(function (req, res) {
            res.status(404).send({ message: "Not found" });
        });
        this.serverInstance = server.listen(port, () => this.isTesting ? "" : console.log(`Server listening on port ${port}!`));
    }
}
exports.default = Server;
