#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import program from 'commander';
import whiten from './index';

process.title = "whiten";
program
    .version(require('../package.json').version)
    .usage('[options] <module ...>')
    .option('-r --registry [source]', 'Source to whiten from (npm or apm), if none given npm will be assumed', /^(npm|apm)$/i, 'npm')
    .parse(process.argv);

let modules = program.args;

if (modules.constructor !== Array) {
    program.help();
}

whiten(modules, program.registry, (tar, cb) => {
    let name = modules.join(' ');
    name = name ? name : path.basename(process.cwd());
    tar.pipe(fs.createWriteStream(path.join(process.cwd(), name + '.tar'))).on('finish', () => {
        cb();
    });
});
