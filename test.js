const configure = require('./index');

const config = new configure({
	filename: './testzwkangrc',
});

config.write('name', 'zwkang', { encoding: 'utf-8' });

console.log(config.read('name'));
