import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import request from 'superagent-bluebird-promise';
import download from 'request';
import npmFetch from './npm';

const apmApi = process.env.ATOM_API_URL || 'https://atom.io/api';

function downloadPackage(name, url, dest) {
    download(url).pipe(fs.createWriteStream(path.join(dest, name + ".tgz")));
}

function downloadPackages(extensions, dest) {
    Object.keys(extensions).forEach(extension => {
        downloadPackage(extension, extensions[extension], dest);
    });
}

export default function fetch(port, config, storagePath, modules) {
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
        downloadPackages(extensions, path.join(storagePath, "atom"));
        npmFetch(port, config, path.join(storagePath, "temp"), dependencies);
    });
}
