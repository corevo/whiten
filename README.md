# whiten
npm/apm whitening cli tool

allows you to download npm packages the way they are being kept in sinopia, so that you can append them to an internal or disconnected sinopia server

as well as easily maintain and upgrade your internal sinopia with new packages, so all you internet-less folks can enjoy opensource software

Installation: `$ npm i whiten -g`

Usage: `$ whiten react react-dom` will create a zipped file at the cwd, that you can extract to your sinopia storage directory

## API

`whiten(modules, [registry], callback)`
* modules - array of npm modules (can contain versions e.g. `['react', 'react-dom@0.14.6']`)
* registry - currently only npm
* callback - packed [tar-fs](https://github.com/mafintosh/tar-fs) containing all the packages, and a callback to perform cleanup after the download, call it when you're done!

make sure to call the cb, or garbage will stay in your system

## Example
```javascript
whiten(['react'], 'npm', (tar, cb) => {
  tar.pipe(fs.createWriteStream(path.join(process.cwd(), modules.join(' ') + '.tar'))).on('finish', () => {
    console.log('done!');
    cb();
  });
});
```
