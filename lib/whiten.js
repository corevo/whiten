import YAML from 'yamljs';

const defaultConfig = YAML.load('config.yaml');

export default function whiten(path, registry, modules, storagePath, port) {
    let config = Object.assign(defaultConfig, { storage: storagePath });
}
