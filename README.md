# whiten
npm/apm whitening cli utility

Installation: `$ npm i whiten -g`

Usage: `$ whiten react react-dom` will create a zipped file at the cwd

## API

`whiten(modules, [registry], callback)`
* modules - array of npm modules (can contain versions e.g. `['react', 'react-dom@0.14.6']`)
* registry - currently only npm
* callback - [easy-zip](https://github.com/owenchong/easy-zip) containing all the packages

## Example
```javascript
whiten(['react'], 'npm', (zip) => {
  console.log("do stuff");
});
```
