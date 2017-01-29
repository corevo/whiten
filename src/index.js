import fs from 'fs';
import path from 'path';
import os from 'os';
import mkdirp from 'mkdirp';
import md5 from 'md5';
import randomPort from 'random-port';
import tar from 'tar-fs';
import rimraf from 'rimraf';
import magic from './whiten';

function cleanup(directory) {
    rimraf(directory, (error) => {
        if (error) {
            console.error(error);
        }
    });
}

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
    if (registry === "apm") {
        mkdirp.sync(path.join(tempDir, "atom"));
    }
    randomPort(port => {
        magic(registry, modules, tempDir, port, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                cb(err);
            } else {
                rimraf.sync(path.join(storageDir, '.sinopia-db.json'));
                let packedFolders = ['storage'];
                if (registry === "apm") {
                    packedFolders.push("atom");
                }
                cb(undefined, tar.pack(tempDir, {
                    entries: packedFolders
                }), () => {
                    cleanup(tempDir);
                });
            }
        });
    });
}
