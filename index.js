'use strict'

var format  = require('util').format
var spawn   = require('child_process').spawn
var debug   = require('debug')('node-ramdisk')
var parse   = require('json-parse-safe')

//
//
//

module.exports = RamDisk

function RamDisk (volume) {
  if (!(this instanceof RamDisk)) {
    return new RamDisk(volume)
  }

  var op = uuid()
  debug('uuid: %s :volume: %s', op, volume)

  var os = process.platform
  var scripts = '%s/scripts/%s.sh'

  this.create = function createDisk (size, cb) {
    var file = format(scripts, __dirname, os, 1, size, volume)
    debug('uuid: %s :create disk setup: %s', op, file)
    prc(file, cb)
  }

  this.delete = function deleteDisk (fd, cb) {
    var file = format(scripts, __dirname, os, 2, fd.mountPoint, fd.deviceNode)
    debug('uuid: %s :delete disk setup: %s', op, file)
    prc(file, cb)
  }

  function prc (file, cb) {
    var dataB  = new Buffer(0)
    var errorB = new Buffer(0)

    var cmd = exec(file)

    cmd.stdout.on('data', stdout)
    cmd.stderr.on('data', stderr)
    cmd.on('close', close)

    function stdout (data) {
      debug('uuid: %s :stdout: %s', op, data)
      dataB = Buffer.concat([dataB, data])
    }

    function stderr (data) {
      debug('uuid: %s :stderr: %s', op, data)
      errorB = Buffer.concat([errorB, data])
    }

    function close (code) {
      debug('uuid: %s :exit code: %d', op, code)
      if (cb) {
        var error = errorB.length ?
          new Error(errorB.toString().replace(/\n/, '')) :
          null
        var res = parse(dataB.toString())
        cb(error, res.value, code)
      }
    }
  }

  return this
}

function uuid () {
  return (~~(Math.random() * 1e9)).toString(36)
}

function exec (command) {
  return spawn('/bin/sh', ['-c', command])
}
