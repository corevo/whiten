import path from 'path';
import os from 'os';
import mkdirp from 'mkdirp';
import md5 from 'md5';
import randomPort from 'random-port';
import magic from './whiten';

export default function whiten(savePath, modules, registry) {
    if (!registry) {
        registry = "npm";
    }
    let tempDir = path.join(os.tmpdir(), "whiten-" + md5(new Date().toString()));
    console.log("Downloading to " + tempDir);
    mkdirp.sync(path.join(tempDir, "storage"));
    mkdirp.sync(path.join(tempDir, "temp"));
    randomPort(port => {
        magic(savePath, registry, modules, tempDir, port);
    });
}
