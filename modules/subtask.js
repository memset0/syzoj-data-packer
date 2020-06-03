const utils = require('../utils');

module.exports = {
	check: function ({ filelist }) {
		if (filelist.includes('subtask1') && filelist.includes('subtask2')) {
			return 50;
		} else if (filelist.includes('subtask1')) {
			return 49;
		} else if (filelist.includes('subtask')) {
			return 48;
		}
		return 0;
	},
	pack: function ({ testdata, template }) {
		let subtask = {};
		testdata.forEach(testcase => {
			let subtaskName = testcase.split('/')[0];
			if (subtask[subtaskName]) {
				subtask[subtaskName].push(testcase);
			} else {
				subtask[subtaskName] = [testcase];
			}
		})
		template.subtask = Object.values(subtask).map(cases => ({
			type: 'min',
			cases: cases,
		}));
		let basescore = 100 / template.subtask.length;
		let lastscore = 100 - template.subtask.length * basescore;
		for (let i = 0; i < template.subtask.length; i++) {
			template.subtask[i].score = basescore + (i >= template.subtask.length - lastscore);
		}
		return template;
	}
}