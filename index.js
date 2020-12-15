const userHome = require('user-home');
const fsExtra = require('fs-extra');
const path = require('path');

const defaultSetting = {
	filename: './configurerc',
};

module.exports = configure;

function safeParse(content, opts = {}) {
	try {
		return JSON.parse(content);
	} catch (e) {
		if (opts.throws) {
			throw e;
		}
		return {};
	}
}

function safeStringify(data, opts = {}) {
	try {
		return JSON.stringify(data);
	} catch (e) {
		if (opts.throw) {
			throw e;
		}
		return JSON.stringify({});
	}
}

function merge(prev, next) {
	return Object.assign({}, prev, next);
}

function configure(setting) {
	const opts = Object.assign(defaultSetting, setting);
	this.filePath = path.resolve(userHome, opts.filename);
	this.cache = {};
	fsExtra.ensureFileSync(this.filePath);
	const Content = fsExtra.readFileSync(this.filePath, {
		encoding: opts.encoding,
	});
	this.cache = safeParse(Content, opts);
}

configure.prototype.write = function (key, data, opts) {
	if (this.cache[key] && opts.warn) {
		console.warn(`${key} is duplicate`);
	}
	const insertData = {};
	insertData[key] = data;

	this.cache = merge(this.cache, insertData);
	const content = safeStringify(this.cache);
	fsExtra.writeFileSync(this.filePath, content, opts);
	return this.cache;
};

configure.prototype.read = function (key, opts) {
	return this.cache[key];
};

configure.prototype.clear = function () {
	fsExtra.removeSync(this.filePath);
	this.cache = undefined;
	this.filePath = undefined;
};

configure.prototype.clearCache = function () {
	this.cache = {};
	fsExtra.writeFileSync(this.filePath, '{}');
	return this.cache;
};
