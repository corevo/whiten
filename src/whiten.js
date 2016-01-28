import path from 'path';
import fs from 'fs';
import YAML from 'yamljs';
const exec = require('child_process').exec;

const defaultConfig = YAML.load('lib/config.yaml');

function saveConfig(storagePath) {
    let config = Object.assign(defaultConfig, { storage: path.join(storagePath, 'storage') });
    let configPath = path.join(storagePath, 'config.yaml');
    fs.writeFileSync(configPath, YAML.stringify(config));

    return configPath;
}

export default function whiten(savePath, registry, modules, storagePath, port) {
    let configPath = saveConfig(storagePath);
    exec(`node ${path.resolve(__dirname + "/registry/npm.js")} ${port} ${configPath} ${path.join(storagePath, "temp")} ${modules.join(',')}`, (err, stdout, stderr) => {
        console.log(stdout);
    });
}
