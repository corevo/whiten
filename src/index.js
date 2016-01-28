import path from 'path';
import os from 'os';
import mkdirp from 'mkdirp';
import md5 from 'md5';
import randomPort from 'random-port';
import { EasyZip } from 'easy-zip';
import rimraf from 'rimraf';
import magic from './whiten';

export default function whiten(modules, registry, cb) {
    if (!registry || typeof registry !== 'string') {
        cb = typeof registry === 'function' ? registry : undefined;
        registry = "npm";
    }
    let tempDir = path.join(os.tmpdir(), "whiten-" + md5(new Date().toString()));
    console.log("Downloading to " + tempDir);
    let storageDir = path.join(tempDir, "storage");
    mkdirp.sync(storageDir);
    mkdirp.sync(path.join(tempDir, "temp"));
    randomPort(port => {
        magic(registry, modules, tempDir, port, (err, stdout, stderr) => {
            if (err) {
                console.err(err);
            } else {
                rimraf.sync(path.join(storageDir, '.sinopia-db.json'));
                let zip = new EasyZip();
                zip.zipFolder(storageDir, () => {
                    cb(zip);
                    rimraf(tempDir, (error) => {
                        if (error) {
                            console.error(error);
                        }
                    });
                });
            }
        });
    });
}
