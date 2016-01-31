import request from 'superagent';

const apmApi = process.env.ATOM_API_URL || 'https://atom.io/api';

export default function fetch(port, config, path, modules) {
    request.get(`${apmApi}/packages/${modules[0]}`).end((err, res) => {
        if (!err) {
            let extension = JSON.parse(res.text);
            let latest = extension.versions[extension.releases.latest];
        }
    });
}
