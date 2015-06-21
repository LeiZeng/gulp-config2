import gutil from 'gulp-util'

var gulp = require('gulp')
var gconf = require('../src/index')

afterEach(() => {
  gconf.reset()
})
describe('Gulp Config initial', () => {
  it('should be able to use a gulp context', () => {
    gconf.use(gulp).getGulp().should.be.equal(gulp)
  })
})

describe('Gulp Config Task Load', () => {
  it('should add a default task from task name', () => {
    gulp.hasTask('copy').should.be.equal(false)
    gconf.loadTasks('copy')
    gulp.hasTask('copy').should.be.equal(true)
  })

  it('should add a task from npm module name', () => {
    gulp.hasTask('gulp-sass').should.be.equal(false)
    gconf.loadTasks('gulp-sass')
    gulp.hasTask('gulp-sass').should.be.equal(true)
  })

  it('should remove custom task after reset', () => {
    gconf.loadTasks('gulp-sass')
    gconf.loadTasks('copy')
    gulp.hasTask('gulp-sass').should.be.equal(true)
    gconf.reset()
    gulp.hasTask('gulp-sass').should.be.equal(false)
    gulp.hasTask('copy').should.be.equal(false)
  })

  it('should add multiple tasks from module names', () => {
    gulp.hasTask('gulp-sass').should.be.equal(false)
    gulp.hasTask('copy').should.be.equal(false)
    gconf.loadTasks('copy', 'gulp-sass')
    gulp.hasTask('copy').should.be.equal(true)
    gulp.hasTask('gulp-sass').should.be.equal(true)
  })

  it('should add tasks from file name', () => {
    gulp.hasTask('custom-task').should.be.equal(false)
    gconf.loadTasks('./test/custom-task')
    gulp.hasTask('custom-task').should.be.equal(true)
  })
})
describe('Gulp Config Task Configuration', () => {
  beforeEach(() => {
    gconf.loadTasks(
      'copy',
      'gulp-sass',
      './test/custom-task')
  })
  afterEach(() => {
    gconf.reset()
  })

  it('should set the global configuration of src and dest', () => {
    gconf.getConf().src.should.be.equal('src/{**/}*.*')
    gconf.getConf().dest.should.be.equal('public')
    gconf({
      src: 'another-src/{**/}*.*',
      dest: 'another-public'
    })
    gconf.getConf().src.should.be.equal('another-src/{**/}*.*')
    gconf.getConf().dest.should.be.equal('another-public')
  })

  it('should set the configuration of a default task', () => {
    gconf({
      copy: {
        src: 'another-src/{**/}*.*',
        dest: 'another-public'
      }
    })
    gconf.getConf().copy.src.should.be.equal('another-src/{**/}*.*')
    gconf.getConf().copy.dest.should.be.equal('another-public')
  })
})
