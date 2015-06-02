'use strict'

var Lab   = require('lab')
var Code  = require('code')

var lab = module.exports.lab = Lab.script()

var describe  = lab.describe
var it        = lab.it
var expect    = Code.expect

var ramdisk = require('./')

describe('ramdisk on ' + process.platform, function() {
  it('create a ram disk with 10MB', function(done) {
    var newDisk = ramdisk('disk0')

    newDisk.create(10, function(err, data) {
      expect(err).to.be.null()
      expect(data).to.exist()

      newDisk.delete(data, function(err, res) {
        expect(err).to.be.null()
        expect(res).to.equal('ok')
        done()
      })
    })
  })

  it('methods should work without the callback', function(done) {
    var newDisk = ramdisk('disk1')

    newDisk.create(10, function(err, data) {
      expect(err).to.be.null()
      expect(data).to.exist()
      newDisk.delete(data)
      setTimeout(done, 200)
    })
  })

  it('stderr', function(done) {
    var newDisk = ramdisk('disk2')

    newDisk.create(10, function(err, data) {
      expect(err).to.be.null()
      expect(data).to.exist()

      newDisk.delete(data, function(err, res) {
        expect(err).to.be.null()
        expect(res).to.equal('ok')

        // should return an error since the device don't exist no more
        newDisk.delete(data, function(err, res) {
          expect(err).to.exist()
          expect(res).to.be.undefined()
          done()
        })
      })
    })
  })

  it('tries to create the same ramdisk twice should fail', function(done) {
    var newDisk = ramdisk('disk3')

    newDisk.create(10, function(err, data) {
      expect(err).to.be.null()
      expect(data).to.exist()

      newDisk.create(10, function(err, res) {
        expect(err).to.exist()
        expect(res).to.be.undefined()
        newDisk.delete(data, function() {done()})
      })
    })
  })
})
