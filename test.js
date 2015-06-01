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

    newDisk.create(10, function(err, data, code) {
      expect(err).to.be.null()
      expect(data).to.exist()
      expect(code).to.equal(0)

      newDisk.delete(data, function(err1, data1, code1) {
        expect(err1).to.be.null()
        expect(data1).to.be.undefined()
        expect(code1).to.equal(0)
        done()
      })
    })
  })

  it('methods should work without the callback', function(done) {
    var newDisk = ramdisk('disk1')

    newDisk.create(10, function(err, data, code) {
      expect(err).to.be.null()
      expect(data).to.exist()
      expect(code).to.equal(0)
      newDisk.delete(data)
      setTimeout(done, 200)
    })
  })

  it('stderr', function(done) {
    var newDisk = ramdisk('disk2')

    newDisk.create(10, function(err, data, code) {
      expect(err).to.be.null()
      expect(data).to.exist()
      expect(code).to.equal(0)

      newDisk.delete(data, function(err1, data1, code1) {
        expect(err1).to.be.null()
        expect(data1).to.be.undefined()
        expect(code1).to.equal(0)

        // should return an error since the device don't exist no more
        newDisk.delete(data, function(err2, data2, code2) {
          expect(err2).to.exist()
          expect(data2).to.be.undefined()
          expect(code2).to.equal(1)
          done()
        })
      })
    })
  })

  it('tries to create the same ramdisk twice should fail', function(done) {
    var newDisk = ramdisk('disk3')

    newDisk.create(10, function(err, data, code) {
      expect(err).to.be.null()
      expect(data).to.exist()
      expect(code).to.equal(0)

      newDisk.create(10, function(err1, data1, code1) {
        expect(err1).to.exist()
        expect(data1).to.be.undefined()
        expect(code1).to.equal(1)
        newDisk.delete(data, function() {done()})
      })
    })
  })
})
