import program from 'commander';

process.title = "whiten";
program
    .version(require('../package.json').version)
    .usage('[-r] <module ...>')
    .option('-r --registry [source]', 'Source to whiten from (npm), if none given npm will be assumed', /^(npm)$/i, 'npm')
    .parse(process.argv);

let modules = program.args;

if (modules.constructor !== Array) {
    console.error("Provide modules separated by spaces e.g. whiten babel react react-dom");
    process.exit(1);
}

if (modules.length < 1) {
    console.error("No modules were specified e.g. whiten babel react react-dom")
    process.exit(1);
}
