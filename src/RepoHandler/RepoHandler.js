"use strict";
exports.__esModule = true;
var fs = require("fs");
var spawn = require("child_process").spawn;
var rimraf = require("rimraf");
var RepoHandler = /** @class */ (function () {
    function RepoHandler(path) {
        if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
            this.directoryPath = path;
        }
        else {
            throw new Error("Please provide correct path to repos folder!");
        }
    }
    /**
     * GET /api/repos
     * Возвращает массив репозиториев, которые имеются в папке.
     */
    RepoHandler.prototype.getRepos = function () {
        return fs
            .readdirSync(this.directoryPath, { withFileTypes: true })
            .filter(function (file) { return file.isDirectory(); })
            .map(function (file) { return file.name; });
    };
    /**
     * GET /api/repos/:repositoryId/commits/:commitHash
     * Возвращает массив коммитов в данной ветке (или хэше коммита) вместе с датами их создания и названием.
     */
    RepoHandler.prototype.getCommits = function (repoID, commitHash) {
        return spawn("git", ["--no-pager", "log", commitHash, "--format=%H|%s|%ct"], {
            cwd: this.directoryPath + "/" + repoID
        });
    };
    /**
     * GET /api/repos/:repositoryId/commits/:commitHash/diff
     * Возвращает diff коммита в виде строки.
     */
    RepoHandler.prototype.getCommitDiff = function (repoID, commitHash) {
        // doesn't work for first commit :(
        // return spawn('git', ['diff', `${commitHash}~`, commitHash, '--unified=0'], {
        return spawn("git", ["show", commitHash, "-m"], {
            cwd: this.directoryPath + "/" + repoID
        });
    };
    /**
     * GET /api/repos/:repositoryId(/tree/:commitHash/:path)
     * Возвращает содержимое репозитория по названию ветки (или хэшу комита).
     * Параметр repositoryId - название репозитория (оно же - имя папки репозитория).
     * То, что в скобках - опционально, если отсутствует и branchName, и path - отдать актуальное содержимое в корне в главной ветке репозитория.
     */
    RepoHandler.prototype.getContent = function (repoID, commitHash, path) {
        // '--name-only'
        var options = ["ls-tree"];
        if (typeof commitHash !== "undefined") {
            options.push(commitHash);
        }
        else {
            options.push("master");
        }
        if (typeof path !== "undefined") {
            options.push(path);
        }
        options.push("--");
        return spawn("git", options, {
            cwd: this.directoryPath + "/" + repoID
        });
    };
    /**
     * GET /api/repos/:repositoryId/blob/:commitHash/:pathToFile
     * Возвращает содержимое конкретного файла, находящегося по пути pathToFile в ветке (или по хэшу коммита) branchName.
     * С используемой памятью должно быть все в порядке.
     */
    RepoHandler.prototype.getFileContent = function (repoID, commitHash, path) {
        return spawn("git", ["show", commitHash + ":" + path], {
            cwd: this.directoryPath + "/" + repoID
        });
    };
    /**
     * DELETE /api/repos/:repositoryId
     * Безвозвратно удаляет репозиторий.
     */
    RepoHandler.prototype.deleteRepo = function (repoID) {
        rimraf(this.directoryPath + "/" + repoID, function () {
            console.log("Repository deleted: " + repoID);
        });
    };
    /**
     * DELETE /api/repos/:repositoryId
     * Безвозвратно удаляет репозиторий.
     */
    RepoHandler.prototype.cloneRepo = function (url) {
        return spawn("git", ["clone", url], {
            cwd: this.directoryPath
        });
    };
    /**
     * GET /api/repos/:repositoryId/letters
     * HTTP-запрос для подсчета символов в репозитории, возвращает объект, в котором ключ - это символ,
     * а значение - количество таких символов в репозитории. Во время запроса, сервер должен работать - то есть отвечать на другие запросы.
     */
    RepoHandler.prototype.getLettersData = function () {
        var SymbolReadStream = require('../SymbolReadStream');
        var resultObject = {};
        var r = new SymbolReadStream('src/test.txt', {
            encoding: 'utf8'
        }, resultObject);
        return r;
    };
    return RepoHandler;
}());
exports["default"] = RepoHandler;
;
