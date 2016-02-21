import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import request from 'superagent-bluebird-promise';
import download from 'request';
import npmFetch from './npm';

const apmApi = process.env.ATOM_API_URL || 'https://atom.io/api';

function finish(otherFinished) {
    if (!otherFinished) {
        return true;
    } else {
        process.exit(0);
    }
}

function downloadPackage(name, url, dest, cb) {
    download(url).pipe(fs.createWriteStream(path.join(dest, name + ".tgz"))).on('finish', cb);
}

function downloadPackages(extensions, dest, cb) {
    let extensionsCount = Object.keys(extensions).length;
    Object.keys(extensions).forEach(extension => {
        downloadPackage(extension, extensions[extension], dest, () => {
            extensionsCount--;
            if (extensionsCount === 0) {
                cb();
            }
        });
    });
}

export default function fetch(port, config, storagePath, modules) {
    let otherFinished = false;
    let { dependencies, extensions } = Promise.all(modules.map(module => (
        request.get(`${apmApi}/packages/${module}`).promise()
    ))).reduce(({ dependencies, extensions }, extension) => {
        extension = JSON.parse(extension.text);
        let pkg = extension.versions[extension.releases.latest];
        let deps = pkg.dependencies;
        return {
            dependencies: [...dependencies, ...Object.keys(deps).map(dep => (`${dep}@${deps[dep]}`))],
            extensions: Object.assign(extensions, {
                [`${pkg.name}@${pkg.version}`]: pkg.dist.tarball
            })
        }
    }, {
        dependencies: [],
        extensions: {}
    }).then(({ dependencies, extensions }) => {
        downloadPackages(extensions, path.join(storagePath, "atom"), () => {
            otherFinished = finish(otherFinished);
        });
        npmFetch(port, config, path.join(storagePath, "temp"), dependencies, () => {
            otherFinished = finish(otherFinished);
        });
    });
}

if (require.main === module) {
    let [proc, startPath, port, config, storage, modules] = process.argv;
    modules = modules.split(',');
    fetch(port, config, storage, modules);
}
