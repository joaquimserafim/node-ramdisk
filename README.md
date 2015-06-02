# node-ramdisk

create a ram disk with node.js

<a href="https://nodei.co/npm/node-ramdisk/"><img src="https://nodei.co/npm/node-ramdisk.png?downloads=true"></a>

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://travis-ci.org/joaquimserafim/node-ramdisk)![Code Coverage 100%](https://img.shields.io/badge/code%20coverage-100%25-green.svg?style=flat-square)[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/joaquimserafim/node-ramdisk/blob/master/LICENSE)


## API
```js
var ramdisk = require('node-ramdisk')
```
return a `ramdisk` object


#### ramdisk(volumeName) 
`var disk = ramdisk('my_ramdisk')`

##### ramdisk#create(size[, callback(err, mount)])
*   **size** - {integer} the size of the volume in MB
*   **callback** - {function}
    -   **err**   - {Error} error message
    -   **mount** - {string} the mounted block, in case of error is undefined

##### ramdisk#delete(volume[, callback(err, res)])
*   **mount** - {string} the mounted block
*   **callback** {function}
    -   **err** - {Error} error message
    -   **res** - {string} return 'ok' in case of success, in case of error is undefined

>Note: delete will eject the volume and remove the mount folder


## Usage

```js
var ramdisk = require('node-ramdisk')

var disk = ramdisk('my_ramdisk')

var volumePoint

// create a disk with 100MB of size
disk.create(100, function (err, mount) {
  if (err) {
    console.log(err)
  } else {
    volumePoint = mount
    console.log(mount)
  }
})

// when isn't needed then delete the disk
disk.delete(volumePoint, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('ok')
  }
})
```

### Debug

`DEBUG=node-ramdisk ...`

### Supported OS

*   **darwin** *(bad performance - is taking around 1 sec. to create the disk in my macbook pro mid 2012)*
*   **linux** *(good performance - 20/30 mls to create the disk in a vagrant vm with few resources)*

### Development

##### this projet has been set up with a precommit that forces you to follow a code style, no jshint issues and 100% of code coverage before commit


to run test
``` js
npm test
```

to run jshint
``` js
npm run jshint
```

to run code style
``` js
npm run code-style
```

to run check code coverage
``` js
npm run check-coverage
```

to open the code coverage report
``` js
npm run open-coverage
```
