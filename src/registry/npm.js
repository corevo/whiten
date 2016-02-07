import setupEnv from '../env/sinopia';
const exec = require('child_process').exec;

function install(registry, path, modules) {
    exec(`npm i --force --prefix ${path} --registry="${registry}" ${modules.join(' ')}`, (err, stdout, stderr) => {
        let code = 0;
        if (err) {
            code = 1;
            console.error(stderr);
        }
        if (require.main === module) {
            process.exit(code);
        } else {
            cb(() => {
                process.exit(code);
            });
        }
    });
}

export default function fetch(port, config, path, modules, cb) {
    setupEnv(port, config);
    require('sinopia/lib/cli');
    install(`http://localhost:${port}/`, path, modules, cb);
}

if (require.main === module) {
    let [proc, startPath, port, config, path, modules] = process.argv;
    modules = modules.split(',');
    fetch(port, config, path, modules);
}
