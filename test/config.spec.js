import should from 'should'

import config from '../src/config'

describe('Gulp Configuration Utils', () => {
  it('log should return item itself', () => {
    should(config.log(null)).be.equal(null)
    config.log('any').should.be.equal('any')
  })
  it('getMapByPath should', () => {
    const map = {src: '123', copy: {src: 'copy'}}
    config.getMapByPath('src', map).should.be.equal('123')
    config.getMapByPath('copy.src', map).should.be.equal('copy')
  })
})
describe.only('Gulp Configuration', () => {
  beforeEach(() => {
    config.reset()
  })

  it('should get default config of src and dest', () => {
    config.get().src.should.be.equal('src/**/*.*')
    config.get().dest.should.be.equal('public')
    config.get('src').should.be.equal('src/**/*.*')
    config.get('dest').should.be.equal('public')
  })

  it('should get default config after reset', () => {
    config({
      src: '333',
      dest: '3333'
    })
    config.reset()
    config.get().src.should.be.equal('src/**/*.*')
    config.get().dest.should.be.equal('public')
    config.get('src').should.be.equal('src/**/*.*')
    config.get('dest').should.be.equal('public')
  })

  it('should get config of given key', () => {
    config({
      src: '123',
      dest: '222'
    })
    config.get('src').should.be.equal('123')
    config.get('dest').should.be.equal('222')
  })

  it('should get config of configured key', () => {
    config.get('src').should.be.equal('src/**/*.*')
    config.get('dest').should.be.equal('public')
    config({
      copy: {
        src: '123',
        dest: '123'
      }
    })
    config.get('copy.src').should.be.equal('123')
    config.get('copy.dest').should.be.equal('123')
  })

  it('should get config of given key and deeper', () => {
    config({
      copy: {
        src: '123',
        dest: '123',
        options: {
          readonly: true
        }
      }
    })
    config.get('copy.options.readonly').should.be.equal(true)
  })

  it('should get null when missing', () => {
    config({
      js: {
        src: '123',
        dest: '123',
        clean: {
          src: 'clean'
        },
        copy: null
      }
    })
    config.get('js.clean.src').should.be.equal('clean')
    should(config.get('java')).not.be.exist
    should(config.get('js.copy.key')).not.be.exist
    should(config.get('js.copy.key.foo.boo')).not.be.exist
  })
})
