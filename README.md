# whiten
npm/apm whitening cli tool

allows you to download npm packages the way they are being kept in sinopia, so that you can append them to an internal or disconnected sinopia server

easily maintain and update your internal sinopia with new packages, so all you internet-less folks can enjoy opensource software

Installation: `$ npm i whiten -g`

Usage: `$ whiten react react-dom` will create a tar at the cwd, that you can extract to your sinopia storage directory

Note: apm doesn't take versions! (latest will always be assumed)

## Updating your Sinopia

* use whiten `$ whiten react`
* extract `react.tar` to your sinopia's storage directory
* profit :dollar:

### Updating apm

in addition to the steps above
* use whiten `$ whiten -r apm react`
* from the extracted tar, place the atom folder contents inside your atom's sinopia (in order to avoid conflicts with same package names)
* get some :beer:

## API

`whiten(modules, [registry], callback)`
* modules - array of npm modules (can contain versions e.g. `['react', 'react-dom@0.14.6']`)
* registry - npm or apm for atom packages (Note: doesn't require apm available in PATH)
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
