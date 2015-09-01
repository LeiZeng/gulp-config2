import should from 'should'

import config from '../src/config'

describe.only('Gulp Configuration', () => {
  beforeEach(() => {
    config.reset()
  })

  it('should get default config of src and dest', () => {
    config.getConf().src.should.be.equal('src/**/*.*')
    config.getConf().dest.should.be.equal('public')
    config.getConf('src').should.be.equal('src/**/*.*')
    config.getConf('dest').should.be.equal('public')
  })

  it('should get default config after reset', () => {
    config({
      src: '333',
      dest: '3333'
    })
    config.reset()
    config.getConf().src.should.be.equal('src/**/*.*')
    config.getConf().dest.should.be.equal('public')
    config.getConf('src').should.be.equal('src/**/*.*')
    config.getConf('dest').should.be.equal('public')
  })

  it('should get config of given key', () => {
    config({
      src: '123',
      dest: '123'
    })
    config.getConf('src').should.be.equal('123')
    config.getConf('dest').should.be.equal('123')
  })

  it('should get config of configured key', () => {
    config.getConf('copy.src').should.be.equal('src/**/*.*')
    config.getConf('copy.dest').should.be.equal('public')
    config({
      copy: {
        src: '123',
        dest: '123'
      }
    })
    config.getConf('copy.src').should.be.equal('123')
    config.getConf('copy.dest').should.be.equal('123')
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
    config.getConf('copy.options.readonly').should.be.equal(true)
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
    should(config.getConf('java')).not.be.exist
    should(config.getConf('js.copy.key')).not.be.exist
    should(config.getConf('js.copy.key.foo.boo')).not.be.exist
  })
})
