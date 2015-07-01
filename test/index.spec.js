import gutil from 'gulp-util'
import fs from 'fs'
import gulp from 'gulp'
import gconf from '../src/index'

afterEach(() => {
  gconf.reset()
})

describe('Gulp Config', () => {
  describe('Initial', () => {
    it('should be able to use a gulp context', () => {
      gconf.use(gulp).getGulp().should.be.equal(gulp)
    })
  })

  describe('Task Load', () => {
    it('should add a default task from task name', () => {
      gulp.hasTask('copy').should.be.equal(false)
      gconf.load('copy')
      gulp.hasTask('copy').should.be.equal(true)
    })

    it('should add a task from npm module name', () => {
      gulp.hasTask('gulp-mocha').should.be.equal(false)
      gconf.load('gulp-mocha')
      gulp.hasTask('gulp-mocha').should.be.equal(true)
    })

    it('should remove custom task after reset', () => {
      gconf.load('gulp-mocha')
      gconf.load('copy')
      gulp.hasTask('gulp-mocha').should.be.equal(true)
      gconf.reset()
      gulp.hasTask('gulp-mocha').should.be.equal(false)
      gulp.hasTask('copy').should.be.equal(false)
    })

    it('should add multiple tasks from module names', () => {
      gulp.hasTask('gulp-mocha').should.be.equal(false)
      gulp.hasTask('copy').should.be.equal(false)
      gconf.load('copy', 'gulp-mocha')
      gulp.hasTask('copy').should.be.equal(true)
      gulp.hasTask('gulp-mocha').should.be.equal(true)
    })

    it('should add tasks from file name', () => {
      gulp.hasTask('custom-task').should.be.equal(false)
      gconf.load('./test/custom-task')
      gulp.hasTask('custom-task').should.be.equal(true)
    })

    it('should add tasks and rename the task from file', () => {
      gulp.hasTask('mytask').should.be.equal(false)
      gconf.load({mytask: './test/custom-task'})
      gulp.hasTask('mytask').should.be.equal(true)
    })
  })

  describe('Task Configuration', () => {
    beforeEach(() => {
      gconf.load(
        'copy',
        'gulp-mocha',
        './test/custom-task')
    })

    it('should set the global configuration of src and dest', () => {
      gconf.getConf('src').should.be.equal('src/**/*.*')
      gconf.getConf('dest').should.be.equal('public')
      gconf({
        src: 'another-src/**/*.*',
        dest: 'another-public'
      })
      gconf.getConf('src').should.be.equal('another-src/**/*.*')
      gconf.getConf('dest').should.be.equal('another-public')
    })

    it('should set the configuration of a default task', () => {
      gconf({
        copy: {
          src: 'another-src/**/*.*',
          dest: 'another-public'
        }
      })
      gconf.getConf().copy.src.should.be.equal('another-src/**/*.*')
      gconf.getConf().copy.dest.should.be.equal('another-public')
    })
  })

  describe('Run gulp tasks', () => {
    it('should run a copy task', cb => {
      gconf.load('copy')
      gconf({
        src: 'test/test.scss'
      })
      gulp.hasTask('copy').should.be.equal(true)
      gulp.start('copy', () => {
        // NOTE cwd changes to the module base
        fs.exists('public/test.scss', exists => {
          exists.should.be.equal(true)
          cb()
        })
      })
    })

    it('should load a pipe line from npm modules', cb => {
      gconf.pipelines({
        js: ['gulp-eslint', 'copy']
      })
      gconf({
        js: {
          src: 'src/*.js',
          'gulp-eslint': {
            test : 'test'
          }
        }
      })
      gulp.hasTask('js').should.be.equal(true)
      gconf.getConf().js.src.should.be.equal('src/*.js')
      gulp.start('js', cb)
    })

    it('should load a quque', cb => {
      gconf.queue({
        js: ['clean', 'gulp-eslint', 'copy']
      })
      gconf({
        js: {
          src: 'src/*.js',
          clean: {
            src: 'public'
          },
          'gulp-eslint': {
            test : 'test'
          }
        }
      })
      gulp.hasTask('js').should.be.equal(true)
      gconf.getConf().js.src.should.be.equal('src/*.js')
      gulp.start('js', cb)
    })
  })
})
