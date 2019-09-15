const express = require('express');
const mime = require('mime-types');
const path = require('path');
const bodyParser = require('body-parser');
// const utf8 = require('utf8');

class Server {
	constructor(repoHandler) {
		this.repoHandler = repoHandler;
	}

	run() {
		const server = express();
		const port = 3000;

		server.use(bodyParser.json());

		server.get('/', (req, res) => res.send('Hello World!'));

		server.get('/api/repos', (req, res) => {
			try {
				const repos = this.repoHandler.getRepos();
				res.json({ data: repos });
			} catch (err) {
				res.status(500).send({ message: `Error: ${err}` });
			}
		});

		server.get('/api/repos/:repositoryId/commits/:commitHash', (req, res) => {
			try {
				const process = this.repoHandler.getCommits(
					req.params.repositoryId,
					req.params.commitHash
				);
				let result = '';
				const keys = ['hash', 'name', 'date-timestamp'];
				process.stdout.on('data', function(data) {
					result += data.toString();
				});
				process.on('close', function() {
					if (result.length === 0) {
						res
							.status(404)
							.json({ message: 'branchName or commitHash does not exist' });
					} else {
						res.json({
							data: result
								.trim()
								.split('\n')
								.map(elem =>
									elem.split('|').reduce((acc, val, i) => {
										acc[keys[i]] = val;
										return acc;
									}, {})
								)
						});
					}
				});
			} catch (err) {
				console.log(err);
			}
		});

		server.get(
			'/api/repos/:repositoryId/commits/:commitHash/diff',
			(req, res) => {
				try {
					const process = this.repoHandler.getCommitDiff(
						req.params.repositoryId,
						req.params.commitHash
					);
					let result = '';
					process.stdout.on('data', function(data) {
						result += data.toString();
					});
					process.on('close', function() {
						res.json({
							data: result
						});
					});
				} catch (err) {
					console.log(err);
				}
			}
		);

		server.get(
			[
				'/api/repos/:repositoryId',
				'/api/repos/:repositoryId/tree/:commitHash?/:path([^/]*)?'
			],
			(req, res) => {
				try {
					const process = this.repoHandler.getContent(
						req.params.repositoryId,
						req.params.commitHash,
						req.params.path
					);
					let result = '';
					process.stdout.on('data', function(data) {
						result += data.toString();
					});
					process.on('close', function() {
						if (result.length === 0) {
							res.status(404).json({
								message: 'Branch or directory is empty or not exists'
							});
						} else {
							res.json({
								data: result.trim().split('\n')
							});
						}
					});
				} catch (err) {
					console.log(err);
				}
			}
		);

		server.get(
			'/api/repos/:repositoryId/blob/:commitHash/:pathToFile([^/]*)?',
			(req, res) => {
				try {
					const process = this.repoHandler.getFileContent(
						req.params.repositoryId,
						req.params.commitHash,
						req.params.pathToFile
					);
					let result = '';
					process.stdout.on('data', function(data) {
						result += data.toString();
					});
					process.on('close', function() {
						if (result.length === 0) {
							res.status(404).json({
								message: 'File is empty or not exists'
							});
						} else {
							const contentType = mime.contentType(
								path.extname(req.params.pathToFile)
							);
							res.type(contentType);
							// console.log(contentType);
							// res.write(result);
							// res.send();
							res.send(result.toString());
						}
					});
					process.on('uncaughtException', ex => {
						console.log(ex);
						process.exit(1);
					});
				} catch (err) {
					console.log(err);
				}
			}
		);

		server.delete('/api/repos/:repositoryId', (req, res) => {
			try {
				this.repoHandler.deleteRepo(req.params.repositoryId);
				res
					.status(200)
					.json({ message: `${req.params.repositoryId} is doesn't exist now` });
			} catch (err) {
				res.status(500).send({ message: `Error: ${err}` });
			}
		});

		server.post('/api/repos', (req, res) => {
			const { url } = req.body;
			try {
				this.repoHandler.cloneRepo(url);
				res.status(200).json({ message: 'Repo cloned' });
			} catch (err) {
				res.status(500).send({ message: `Error: ${err}` });
			}
		});

		server.use(function(req, res) {
			res.status(404).send({ message: 'Not found' });
		});

		server.listen(port, () => console.log(`Server listening on port ${port}!`));
	}
}

module.exports = Server;
