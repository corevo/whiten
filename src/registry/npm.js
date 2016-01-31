import setupEnv from '../env/sinopia';
const exec = require('child_process').exec;

function install(registry, path, modules) {
    exec(`npm i --force --prefix ${path} --registry="${registry}" ${modules.join(' ')}`, (err, stdout, stderr) => {
        if (!err)
            process.exit(0);
        process.exit(1)
    });
}

function fetch(port, config, path, modules) {
    setupEnv(port, config);
    require('sinopia/lib/cli');
    install(`http://localhost:${port}/`, path, modules);
}

if (require.main === module) {
    let [proc, startPath, port, config, path, modules] = process.argv;
    modules = modules.split(',');
    fetch(port, config, path, modules);
}
