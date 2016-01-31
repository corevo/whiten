import request from 'superagent-bluebird-promise';

const apmApi = process.env.ATOM_API_URL || 'https://atom.io/api';

export default function fetch(port, config, path, modules) {
    let packages = modules.map(module => (
        request.get(`${apmApi}/packages/${modules[0]}`).promise()
    ));
}
