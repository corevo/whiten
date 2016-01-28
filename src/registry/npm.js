import setupEnv from '../env/sinopia';
const exec = require('child_process').exec;

function fetch(registry, path, modules) {
    exec(`npm i --force --prefix ${path} --registry="${registry}" ${modules.join(' ')}`, (err, stdout, stderr) => {
        if (!err)
            process.exit(0);
        process.exit(1)
    });
}

let [proc, startPath, port, config, path, modules] = process.argv;
modules = modules.split(',');
setupEnv(port, config);
require('sinopia/lib/cli');
fetch(`http://localhost:${port}/`, path, modules);
