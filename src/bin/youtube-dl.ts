//original: https://github.com/ghjbnm/youtube-dl-wrap/blob/master/index.js

const EventEmitter = require('events').EventEmitter;
const execFile = require('child_process').execFile;

import https from 'https';

const Readable = require('stream').Readable;
const spawn = require('child_process').spawn;

export default class YoutubeDlWrap {
	progressRegex: RegExp;
	binaryPath: any;
	constructor(binaryPath: any) {
		this.progressRegex = /\[download\] *(.*) of (.*) at (.*) ETA (.*)/;
		this.setBinaryPath(binaryPath ? binaryPath : 'youtube-dl');
	}

	getBinaryPath() {
		return this.binaryPath;
	}
	setBinaryPath(binaryPath: any) {
		this.binaryPath = binaryPath;
	}

	static getGithubReleases(page = 1, perPage = 1) {
		return new Promise((resolve, reject) => {
			const apiURL = 'https://api.github.com/repos/ytdl-org/youtube-dl/releases?page=' + page + '&per_page=' + perPage;
			https.get(apiURL, { headers: { 'User-Agent': 'node' } }, response => {
				let resonseString = '';
				response.setEncoding('utf8');
				response.on('data', body => (resonseString += body));
				response.on('error', e => reject(e));
				response.on('end', () => (response.statusCode == 200 ? resolve(JSON.parse(resonseString)) : reject(response)));
			});
		});
	}

	async getHelp() {
		const youtubeDlStdout = await this.execPromise(['--help']);
		return youtubeDlStdout;
	}
	async getUserAgent() {
		const youtubeDlStdout = await this.execPromise(['--dump-user-agent']);
		return youtubeDlStdout;
	}
	async getVersion() {
		const youtubeDlStdout = await this.execPromise(['--version']);
		return youtubeDlStdout;
	}

	/*async getVideoInfo(youtubeDlArguments: string[]) {
	*	if (typeof youtubeDlArguments == 'string') youtubeDlArguments = [youtubeDlArguments];
	*	if (!youtubeDlArguments.includes('-f') && !youtubeDlArguments.includes('--format')) youtubeDlArguments = youtubeDlArguments.concat(['-f', 'best']);
	*
	*	const youtubeDlStdout = await this.execPromise(youtubeDlArguments.concat(['--dump-json']));
	*	try {
	*		return JSON.parse(youtubeDlStdout);
	*	} catch (e) {
	*		return JSON.parse('[' + youtubeDlStdout.replace(/\n/g, ',').slice(0, -1) + ']');
	*	}
	}*/

	setDefaultOptions(options: { maxBuffer?: any }) {
		if (!options.maxBuffer) options.maxBuffer = 1024 * 1024 * 1024;
		return options;
	}

	exec(youtubeDlArguments = [], options = {}) {
		options = this.setDefaultOptions(options);
		const execEventEmitter = new EventEmitter();
		const youtubeDlProcess = spawn(this.binaryPath, youtubeDlArguments, options);

		youtubeDlProcess.stdout.on('data', (data: { toString: () => any }) => {
			const stringData = data.toString();
			const parsedProgress = this.parseProgress(stringData);

			if (parsedProgress) execEventEmitter.emit('progress', parsedProgress);

			execEventEmitter.emit('stdout', stringData);
		});

		let stderrData = '';
		youtubeDlProcess.stderr.on('data', (data: { toString: () => any }) => {
			const stringData = data.toString();
			stderrData += stringData;
			execEventEmitter.emit('stderr', stringData);
		});

		let processError = '';
		youtubeDlProcess.on('error', (error: string) => {
			processError = error;
		});
		youtubeDlProcess.on('close', (code: number) => {
			if (code === 0) execEventEmitter.emit('close', code);
			else execEventEmitter.emit('error', code, processError, stderrData);
		});

		return execEventEmitter;
	}

	execPromise(youtubeDlArguments: string[], options = {}) {
		return new Promise((resolve, reject) => {
			options = this.setDefaultOptions(options);
			execFile(this.binaryPath, youtubeDlArguments, options, (error: any, stdout: any, stderr: any) => {
				if (error) reject({ processError: error, stderr: stderr });
				return resolve(stdout);
			});
		});
	}

	execStream(youtubeDlArguments: string[], options = {}) {
		const readStream = new Readable();
		options = this.setDefaultOptions(options);
		youtubeDlArguments = youtubeDlArguments.concat(['-o', '-']);
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		readStream._read = function () {};
		const youtubeDlProcess = spawn(this.binaryPath, youtubeDlArguments, options);

		let processError = '';
		let stderrData = '';
		youtubeDlProcess.stdout.on('data', (data: any) => readStream.push(data));
		youtubeDlProcess.stderr.on('data', (data: { toString: () => string }) => (stderrData += data.toString()));
		youtubeDlProcess.on('error', (error: string) => (processError = error));
		youtubeDlProcess.on('close', (code: string | number) => {
			readStream.destroy(code == 0 ? false : 'error - ' + code + ' - ' + processError + ' - ' + stderrData);
		});
		return readStream;
	}

	parseProgress(progressLine: string) {
		const progressMatch = progressLine.match(this.progressRegex);
		if (progressMatch == null) return null;

		const progressObject = { percent: 0, totalSize: '', currentSpeed: '', eta: '' };
		progressObject.percent = parseFloat(progressMatch[1].replace('%', ''));
		progressObject.totalSize = progressMatch[2].replace('~', '');
		progressObject.currentSpeed = progressMatch[3];
		progressObject.eta = progressMatch[4];
		return progressObject;
	}
}

module.exports = YoutubeDlWrap;
