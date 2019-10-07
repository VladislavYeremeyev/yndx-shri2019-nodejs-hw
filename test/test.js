const RepoHandler = require('../src/RepoHandler/RepoHandler');
const chai = require('chai');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const request = require('supertest');
const AdmZip = require('adm-zip');
const rimraf = require('rimraf');

const testFolderPath = path.join(__dirname, 'testFolder');

describe('Creating RepoHandler instance', function() {
	before(function() {
		console.log('Unzipping');
		const zip = new AdmZip('test/testFolder.zip');
		zip.extractAllTo('test/', true);
	});

	it('Success instance creating with correct path', function() {
		const repoHandler = new RepoHandler(testFolderPath);
		chai.expect(repoHandler.directoryPath).to.eql(testFolderPath);
	});

	it('Error instance creating with path to not existing folder', function() {
		// Generating random folder name
		let randomID;
		do {
			randomID = uuidv4();
		} while (fs.existsSync(path.join(__dirname, 'testFolder', randomID)));

		chai
			.expect(() => new RepoHandler(path.join(testFolderPath, randomID)))
			.to.throw('Please provide correct path to repos folder!');
	});

	it('Error instance creating with path to file, not folder', function() {
		chai
			.expect(() => new RepoHandler(path.join(testFolderPath, 'file.txt')))
			.to.throw('Please provide correct path to repos folder!');
	});
});

describe('API Methods', function() {
	let server;

	before(function() {
		const repoHandler = new RepoHandler(testFolderPath);
		const Server = require('./../src/Server/Server');
		server = new Server(repoHandler);
		server.isTesting = true;
		server.run();
	});

	after(function() {
		server.serverInstance.close();
		rimraf(testFolderPath, () => {
			console.log('Mock folder deleted');
		});
	});

	describe('Get repos list', function() {
		it('GET /api/repos', function(done) {
			request(server.serverInstance)
				.get('/api/repos')
				.expect('Content-Type', /json/)
				.expect(200, { data: ['repo1', 'repo2'] }, done);
		});
	});

	describe('Get commits', function() {
		it('GET /api/repos/:repositoryId/commits/:commitHash with master branch name', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/commits/master')
				.expect('Content-Type', /json/)
				.expect(
					200,
					{
						data: [
							{
								hash: '1b53498b1b46690f5c8e70e6a44a74369abf8fb1',
								name: 'folder added to master',
								'date-timestamp': '1570413708'
							},
							{
								hash: '4ca7331a04146882872b7aec8d3ec01bb858ff73',
								name: 'file1 update',
								'date-timestamp': '1570405485'
							},
							{
								hash: '51bd064dcbd068468d5c83aa518a69b1465044a9',
								name: 'file1 added',
								'date-timestamp': '1570405060'
							}
						]
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/commits/:commitHash with hash', function(done) {
			// branch2 hash
			request(server.serverInstance)
				.get(
					'/api/repos/repo1/commits/2084e5881ce10caafb9125185bf79d67a37e49a8'
				)
				.expect('Content-Type', /json/)
				.expect(
					200,
					{
						data: [
							{
								hash: '2084e5881ce10caafb9125185bf79d67a37e49a8',
								name: 'file1 feature',
								'date-timestamp': '1570405869'
							},
							{
								hash: '4ca7331a04146882872b7aec8d3ec01bb858ff73',
								name: 'file1 update',
								'date-timestamp': '1570405485'
							},
							{
								hash: '51bd064dcbd068468d5c83aa518a69b1465044a9',
								name: 'file1 added',
								'date-timestamp': '1570405060'
							}
						]
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/commits/:commitHash with wrong branch name', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/commits/wrong-branch')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});

		it('GET /api/repos/:repositoryId/commits/:commitHash with wrong repo id', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo_wrong/commits/master')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});
	});

	describe('Get commit diff', function() {
		it('GET /api/repos/:repositoryId/commits/:commitHash/diff with master branch name', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/commits/master/diff')
				.expect('Content-Type', /json/)
				.expect(
					200,
					{
						data:
							'commit 1b53498b1b46690f5c8e70e6a44a74369abf8fb1\n' +
							'Author: Vladislav Yeremeyev <vlad.yeremeyev@gmail.com>\n' +
							'Date:   Mon Oct 7 05:01:48 2019 +0300\n' +
							'\n' +
							'    folder added to master\n' +
							'\n' +
							'diff --git a/folder/folder_file.txt b/folder/folder_file.txt\n' +
							'new file mode 100644\n' +
							'index 0000000..9007784\n' +
							'--- /dev/null\n' +
							'+++ b/folder/folder_file.txt\n' +
							'@@ -0,0 +1 @@\n' +
							'+folder file\n'
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/commits/:commitHash/diff with hash', function(done) {
			// branch2 hash
			request(server.serverInstance)
				.get(
					'/api/repos/repo1/commits/2084e5881ce10caafb9125185bf79d67a37e49a8/diff'
				)
				.expect('Content-Type', /json/)
				.expect(
					200,
					{
						data:
							'commit 2084e5881ce10caafb9125185bf79d67a37e49a8\n' +
							'Author: Vladislav Yeremeyev <vlad.yeremeyev@gmail.com>\n' +
							'Date:   Mon Oct 7 02:51:09 2019 +0300\n' +
							'\n' +
							'    file1 feature\n' +
							'\n' +
							'diff --git a/file1.txt b/file1.txt\n' +
							'index 1cb85a4..486d647 100644\n' +
							'--- a/file1.txt\n' +
							'+++ b/file1.txt\n' +
							'@@ -1 +1 @@\n' +
							'-test data updated\n' +
							'+test data updated branch\n'
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/commits/:commitHash/diff with wrong branch name', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/commits/wrong-branch/diff')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});

		it('GET /api/repos/:repositoryId/commits/:commitHash/diff with wrong repo id', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo_wrong/commits/master/diff')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});
	});

	describe('Get tree content', function() {
		it('GET /api/repos/:repositoryId', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1')
				.expect('Content-Type', /json/)
				.expect(
					200,
					{
						data: [
							'100644 blob 1cb85a4c4dfc1efa15433fdcbc5c0a127ce1032f\tfile1.txt',
							'040000 tree 3b6abb0b196f7d46be10b5f155baddcdb0bcadf0\tfolder'
						]
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/tree', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/tree')
				.expect('Content-Type', /json/)
				.expect(
					200,
					{
						data: [
							'100644 blob 1cb85a4c4dfc1efa15433fdcbc5c0a127ce1032f\tfile1.txt',
							'040000 tree 3b6abb0b196f7d46be10b5f155baddcdb0bcadf0\tfolder'
						]
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId with wrong repoID', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo_wrong')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});

		it('GET /api/repos/:repositoryId/tree with wrong repoID', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo_wrong/tree')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});

		it('GET /api/repos/:repositoryId/tree/master', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/tree/master')
				.expect('Content-Type', /json/)
				.expect(
					200,
					{
						data: [
							'100644 blob 1cb85a4c4dfc1efa15433fdcbc5c0a127ce1032f\tfile1.txt',
							'040000 tree 3b6abb0b196f7d46be10b5f155baddcdb0bcadf0\tfolder'
						]
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/tree/*hash*', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/tree/2084e5881ce10caafb9125185bf79d67a37e49a8')
				.expect('Content-Type', /json/)
				.expect(
					200,
					{
						data: [
							'100644 blob 486d647f33f3996f1b932df34cb260065462558b\tfile1.txt'
						]
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/tree/*wrong_commit*', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/tree/wrong_commit')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});

		it('GET /api/repos/:repositoryId/tree/branch/*folder*', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/tree/branch2/folder1')
				.expect('Content-Type', /json/)
				.expect(
					200,
					{
						data: [
							'040000 tree ef3257808d3d59346d1f729ccfc23a90d4296984\tfolder1'
						]
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/tree/branch/*wrong_folder_path*', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/tree/branch2/folder_wrong')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});

		it('GET /api/repos/:repositoryId/tree/branch/*folder*/*file*', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/tree/branch2/folder1/file_in_folder.txt')
				.expect('Content-Type', /json/)
				.expect(
					200,
					{
						data: [
							'100644 blob 90077842de78faefbfdaacaca1329e53e26acef6\tfolder1/file_in_folder.txt'
						]
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/tree/branch/*wrong_file_path*', function(done) {
			request(server.serverInstance)
				.get('/api/repos/repo1/tree/branch2/folder1/file_wrong.txt')
				.expect('Content-Type', /json/)
				.expect(404, done);
		});
	});

	describe('Get blob content', function() {
		it('GET /api/repos/:repositoryId/blob/master/*file*', function(done) {
			request(server.serverInstance)
				.get('/api-test/repos/repo1/blob/master/file1.txt')
				.expect(
					200,
					{
						data: 'test data updated\n'
					},
					done
				);
		});

		it('GET /api/repos/*wrong repo path*/blob/master/*file*', function(done) {
			request(server.serverInstance)
				.get('/api-test/repos/wrong_repo/blob/master/file1.txt')
				.expect(404, done);
		});

		it('GET /api/repos/:repositoryId/blob/master/*pathToFile*', function(done) {
			request(server.serverInstance)
				.get('/api-test/repos/repo1/blob/master/folder/folder_file.txt')
				.expect(
					200,
					{
						data: 'folder file\n'
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/blob/hash/*file*', function(done) {
			request(server.serverInstance)
				.get(
					'/api-test/repos/repo1/blob/18f7539e338123da6be4e21fe15be35287a2d7a0/file1.txt'
				)
				.expect(
					200,
					{
						data: 'test data updated branch\n'
					},
					done
				);
		});

		it('GET /api/repos/:repositoryId/blob/hash/*pathToFile*', function(done) {
			request(server.serverInstance)
				.get(
					'/api-test/repos/repo1/blob/18f7539e338123da6be4e21fe15be35287a2d7a0/folder1/file_in_folder.txt'
				)
				.expect(
					200,
					{
						data: 'folder file\n'
					},
					done
				);
		});
	});
});
