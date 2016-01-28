import path from 'path';
import os from 'os';
import mkdirp from 'mkdirp';
import md5 from 'md5';
import randomPort from 'random-port';
import { EasyZip } from 'easy-zip';
import rimraf from 'rimraf';
import magic from './whiten';

export default function whiten(savePath, modules, registry, cb) {
    if (!registry) {
        registry = "npm";
    }
    let tempDir = path.join(os.tmpdir(), "whiten-" + md5(new Date().toString()));
    console.log("Downloading to " + tempDir);
    let storageDir = path.join(tempDir, "storage");
    mkdirp.sync(storageDir);
    mkdirp.sync(path.join(tempDir, "temp"));
    randomPort(port => {
        magic(savePath, registry, modules, tempDir, port, (err, stdout, stderr) => {
            if (err) {
                console.err(err);
            } else {
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
