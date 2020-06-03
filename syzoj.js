const fs = require('fs');
const rd = require('rd');
const _ = require('lodash');
const path = require('path');

const modules = {
	'subtask': require('./modules/subtask'),
}

function main(rootPath, timeLimit = 1000, memoryLimit = 512, inputExtra = ['.in'], outputExtra = ['.out', '.ans']) {
	let filelist = rd.readSync(rootPath).map(o => path.relative(rootPath, o));
	let testdata = {};
	filelist.forEach(file => {
		let basename = path.posix.basename(file, path.extname(file));
		if (inputExtra.includes(path.extname(file))) {
			testdata[basename] = { ...testdata[basename], input: file };
		}
		if (outputExtra.includes(path.extname(file))) {
			testdata[basename] = { ...testdata[basename], output: file };
		}
	});
}

main(path.resolve('./data'))