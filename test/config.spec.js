import should from 'should'

import config from '../src/config'

describe('Gulp Configuration', () => {
  beforeEach(() => {
    config.default()
  })

  it('should get default config of src and dest', () => {
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

  it('should get config of given key and one deps', () => {
    config.getConf('copy', 'src').should.be.equal('src/**/*.*')
    config.getConf('copy', 'dest').should.be.equal('public')
    config({
      copy: {
        src: '123',
        dest: '123'
      }
    })
    config.getConf('copy', 'src').should.be.equal('123')
    config.getConf('copy', 'dest').should.be.equal('123')
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
    config.getConf('copy', 'options', 'readonly').should.be.equal(true)
  })

  it('should get config of nested key with "."', () => {
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
    config.getConf('js.clean', 'src').should.be.equal('clean')
    config.getConf('js.copy', 'src').should.be.equal('123')
    should(config.getConf('js.copy', 'key')).not.be.exist
  })
})
