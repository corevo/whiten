#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import program from 'commander';
import whiten from './index';
import isPackage from './package.js';

process.title = "whiten";
program
    .version(require('../package.json').version)
    .usage('[options] <module ...> or . (to whiten current directory)')
    .option('-r --registry [source]', 'Source to whiten from (npm or apm), if none given npm will be assumed', /^(npm|apm)$/i, 'npm')
    .option('-n --name <name>', 'Save the bundle under the given name, if not given a list of all packages will be used', '')
    .parse(process.argv);

let modules = program.args;

if (modules.constructor !== Array) {
    program.help();
}
if (modules.length === 1 && modules[0] === '.') {
    modules.pop();
}
if (modules.length === 0 && !isPackage(process.cwd())) {
    program.help();
}

whiten(modules, program.registry, (err, tar, cb) => {
    let name = program.name !== '' ? program.name : modules.join(' ').replace('/', '-');
    name = name ? name : path.basename(process.cwd());
    tar.pipe(fs.createWriteStream(path.join(process.cwd(), name + '.tar'))).on('finish', () => {
        cb();
    });
});
