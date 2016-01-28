const exec = require('child_process').exec;

export default function fetch(registry, path, modules, cb) {
    exec(`npm i --force --prefix ${path} --registry="${registry}" ${modules.join(' ')}`, cb);
}
