const fs = require('fs');
const rd = require('rd');
const _ = require('lodash');
const path = require('path');
const stringRandom = require('string-random');

const utils = require('./utils');
const modules = {
	'subtask': require('./modules/subtask'),
}

function main(rootPath, timeLimit = 1000, memoryLimit = 512, inputExtra = ['.in'], outputExtra = ['.out', '.ans'], rename = false) {
	let filelist = rd.readSync(rootPath).map(o => path.relative(rootPath, o));
	let testdata = {};
	filelist.forEach(file => {
		let basename = path.join(file, '..', path.posix.basename(file, path.extname(file)));
		if (inputExtra.includes(path.extname(file))) {
			testdata[basename] = { ...testdata[basename], input: file };
		}
		if (outputExtra.includes(path.extname(file))) {
			testdata[basename] = { ...testdata[basename], output: file };
		}
	});
	if (rename) {
		Object.values(testdata).forEach((testcase) => {
			let key = stringRandom(8, { letters: 'ABCDEF' });
			const generate = file => {
				if (/.+-[0-9A-F]{8}$/.test(path.posix.basename(file, path.extname(file)))) {
					return file
				} else {
					return path.join(file, '..', path.posix.basename(file, path.extname(file)) + '-' + key + path.extname(file));
				}
			}
			fs.renameSync(path.resolve(rootPath, testcase.input), path.resolve(rootPath, generate(testcase.input)));
			fs.renameSync(path.resolve(rootPath, testcase.output), path.resolve(rootPath, generate(testcase.output)));
		})
	}

}

main(path.resolve('./data'))