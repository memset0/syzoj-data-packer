const fs = require('fs');
const rd = require('rd');
const _ = require('lodash');
const path = require('path');
const YAML = require('yaml');
const stringRandom = require('string-random');

const utils = require('./utils');
const modules = {
	'subtask': require('./modules/subtask'),
}

function main(rootpath, possibleInputExtra = ['.in'], possibleOutputExtra = ['.out', '.ans'], rename = false) {
	let filelist = rd.readSync(rootpath).map(o => path.relative(rootpath, o));

	let testdata = {};
	let inputExtra, outputExtra;
	filelist.forEach(file => {
		let basename = path.join(file, '..', path.posix.basename(file, path.extname(file)));
		if (possibleInputExtra.includes(path.extname(file))) {
			testdata[basename] = { ...testdata[basename], input: true };
			if (inputExtra && inputExtra != path.extname(file)) {
				throw new Error('[SYZOJ] 多个可能的输入文件后缀名。');
			} else {
				inputExtra = path.extname(file);
			}
		}
		if (possibleOutputExtra.includes(path.extname(file))) {
			testdata[basename] = { ...testdata[basename], output: true };
			if (outputExtra && outputExtra != path.extname(file)) {
				throw new Error('[SYZOJ] 多个可能的输出文件后缀名。');
			} else {
				outputExtra = path.extname(file);
			}
		}
	});
	testdata = ((src) => {
		let dst = [];
		Object.keys(src).forEach(key => {
			if (src[key].input && src[key].output) {
				dst.push(key)
			}
		})
		return dst
	})(testdata);
	if (rename) {
		testdata.forEach((testcase) => {
			let key = stringRandom(8, { letters: 'ABCDEF' });
			const generate = file => {
				if (/.+-[0-9A-F]{8}$/.test(path.posix.basename(file, path.extname(file)))) {
					return file;
				} else {
					return path.join(file, '..', path.posix.basename(file, path.extname(file)) + '-' + key + path.extname(file));
				}
			};
			fs.renameSync(path.resolve(rootpath, testcase + inputExtra), path.resolve(rootpath, generate(testcase + inputExtra)));
			fs.renameSync(path.resolve(rootpath, testcase + outputExtra), path.resolve(rootpath, generate(testcase + outputExtra)));
		})
	};

}

main(path.resolve('./data'))