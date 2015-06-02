'use strict'

var format  = require('util').format
var spawn   = require('child_process').spawn
var debug   = require('debug')('node-ramdisk')

module.exports = ramdisk

function ramdisk (volume) {
  var op = uuid()
  debug('uuid: %s :volume: %s', op, volume)

  var os = process.platform
  var scripts = '%s/scripts/%s.sh'

  var createDisk = function createDisk (size, cb) {
    var file = format(scripts, __dirname, os, 1, size, volume)
    debug('uuid: %s :create disk setup: %s', op, file)
    prc(file, cb)
  }

  var deleteDisk = function deleteDisk (mount, cb) {
    var file = format(scripts, __dirname, os, 2, mount)
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
        if (code !== 0) {
          var error = new Error(errorB.toString().replace(/\n/, ''))
          cb(error)
        } else {
          var res = dataB.length ? dataB.toString() : 'ok'
          cb(null, res)
        }
      }
    }
  }

  return {
    create: createDisk,
    delete: deleteDisk
  }
}

function uuid () {
  return (~~(Math.random() * 1e9)).toString(36)
}

function exec (command) {
  return spawn('/bin/sh', ['-c', command])
}
