import Promise from 'bluebird';
import request from 'superagent-bluebird-promise';

const apmApi = process.env.ATOM_API_URL || 'https://atom.io/api';

export default function fetch(port, config, path, modules) {
    let { dependencies, extensions } = Promise.all(modules.map(module => (
        request.get(`${apmApi}/packages/${module}`).promise()
    ))).reduce(({ dependencies, extensions }, extension) => {
        extension = JSON.parse(extension.text);
        let pkg = extension.versions[extension.releases.latest];
        let deps = pkg.dependencies;
        return {
            dependencies: [...dependencies, ...Object.keys(deps).map(dep => (`${dep}@${deps[dep]}`))],
            extensions: {
                [`${pkg.name}@${pkg.version}`]: pkg.dist.tarball
            }
        }
    }, {
        dependencies: [],
        extensions: {}
    }).then(({ dependencies, extensions }) => {
    });
}
