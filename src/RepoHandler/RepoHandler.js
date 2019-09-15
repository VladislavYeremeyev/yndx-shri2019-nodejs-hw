const fs = require('fs');
const { spawn } = require('child_process');
const rimraf = require('rimraf');

module.exports = class RepoHandler {
	constructor(directoryPath) {
		if (
			fs.existsSync(directoryPath) &&
			fs.lstatSync(directoryPath).isDirectory()
		) {
			this.directoryPath = directoryPath;
		} else {
			throw new Error('Directory does not exist!');
		}
	}

	/**
	 * GET /api/repos
	 * Возвращает массив репозиториев, которые имеются в папке.
	 */
	getRepos() {
		return fs
			.readdirSync(this.directoryPath, { withFileTypes: true })
			.filter(file => file.isDirectory())
			.map(file => file.name);
	}

	/**
	 * GET /api/repos/:repositoryId/commits/:commitHash
	 * Возвращает массив коммитов в данной ветке (или хэше коммита) вместе с датами их создания и названием.
	 */
	getCommits(repoID, commitHash) {
		return spawn(
			'git',
			['--no-pager', 'log', commitHash, '--format=%H|%s|%ct'],
			{
				cwd: `${this.directoryPath}/${repoID}`
			}
		);
	}

	/**
	 * GET /api/repos/:repositoryId/commits/:commitHash/diff
	 * Возвращает diff коммита в виде строки.
	 */
	getCommitDiff(repoID, commitHash) {
		// doesn't work for first commit :(
		// return spawn('git', ['diff', `${commitHash}~`, commitHash, '--unified=0'], {
		return spawn('git', ['show', commitHash, '-m'], {
			cwd: `${this.directoryPath}/${repoID}`
		});
	}

	/**
	 * GET /api/repos/:repositoryId(/tree/:commitHash/:path)
	 * Возвращает содержимое репозитория по названию ветки (или хэшу комита).
	 * Параметр repositoryId - название репозитория (оно же - имя папки репозитория).
	 * То, что в скобках - опционально, если отсутствует и branchName, и path - отдать актуальное содержимое в корне в главной ветке репозитория.
	 */
	getContent(repoID, commitHash, path) {
		const options = [
			'ls-tree',
			'--name-only',
			'-r'
		];

		if (typeof commitHash !== 'undefined') {
			options.push(commitHash);
		} else {
			options.push('master');
		}
		if (typeof path !== 'undefined') {
			options.push(path);
		}
		return spawn('git', options, {
			cwd: `${this.directoryPath}/${repoID}`
		});
	}

	/**
	 * GET /api/repos/:repositoryId/blob/:commitHash/:pathToFile
	 * Возвращает содержимое конкретного файла, находящегося по пути pathToFile в ветке (или по хэшу коммита) branchName.
	 * С используемой памятью должно быть все в порядке.
	 */
	getFileContent(repoID, commitHash, path) {
		return spawn(
			'git',
			['show', `${commitHash}:${path}`],
			{
				cwd: `${this.directoryPath}/${repoID}`
			}
		);
	}

	/**
	 * DELETE /api/repos/:repositoryId
	 * Безвозвратно удаляет репозиторий.
	 */
	deleteRepo(repoID) {
		rimraf(`${this.directoryPath}/${repoID}`, () => {
			console.log(`Repository deleted: ${repoID}`);
		});
	}

	/**
	 * DELETE /api/repos/:repositoryId
	 * Безвозвратно удаляет репозиторий.
	 */
	cloneRepo(url) {
		return spawn(
			'git',
			['clone', url],
			{
				cwd: this.directoryPath
			}
		);
	}
};
