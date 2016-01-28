import program from 'commander';

process.title = "whiten";
program
    .version(require('../package.json').version)
    .usage('[options] <module ...>')
    .option('-r --registry [source]', 'Source to whiten from (npm), if none given npm will be assumed', /^(npm)$/i, 'npm')
    .parse(process.argv);

let modules = program.args;

if (modules.constructor !== Array || modules.length < 1) {
    program.help();
}
