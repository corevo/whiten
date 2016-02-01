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

if (modules.constructor !== Array || modules.length < 1) {
    program.help();
}

whiten(modules, program.registry, (tar, cb) => {
    tar.pipe(fs.createWriteStream(path.join(process.cwd(), modules.join(' ') + '.tar'))).on('finish', () => {
        cb();
    });
});
