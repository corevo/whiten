import Promise from 'bluebird';
import request from 'superagent-bluebird-promise';

const apmApi = process.env.ATOM_API_URL || 'https://atom.io/api';

export default function fetch(port, config, path, modules) {
    Promise.all(modules.map(module => (
        request.get(`${apmApi}/packages/${module}`).promise()
    ))).map(extension => {
        extension = JSON.parse(extension.text);
        let latest = extension.versions[extension.releases.latest];
    });
}
