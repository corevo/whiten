import path from 'path';
import fs from 'fs';
import YAML from 'yamljs';

const registries = require('require-all')(__dirname + '/registry');
const defaultConfig = YAML.load('lib/config.yaml');

function saveConfig(storagePath) {
    let config = Object.assign(defaultConfig, { storage: path.join(storagePath, 'storage') });
    let configPath = path.join(storagePath, 'config.yaml');
    fs.writeFileSync(configPath, YAML.stringify(config));

    return configPath;
}

function setupEnv(port, config) {
    process.argv.slice(0, 2);
    process.argv = [...process.argv, '-l', port, '-c', config];
}

export default function whiten(savePath, registry, modules, storagePath, port) {
    let configPath = saveConfig(storagePath);
    setupEnv(port, configPath);
    require('sinopia/lib/cli');
    registries[registry].default(`http://localhost:${port}/`, path.join(storagePath, "temp"), modules);
}
