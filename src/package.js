import fs from 'fs';
import path from 'path';

export default function isPackage(directory) {
    try {
        fs.accessSync(path.join(directory, "package.json"));
    } catch (ex) {
        return false;
    }
    return true;
}
