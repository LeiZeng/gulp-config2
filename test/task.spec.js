import should from 'should'
import gulp from 'gulp'
import {spy, stub} from 'sinon'

import {
  getFunc,
  register,
  run
} from '../src/task'

describe('Task', () => {
  beforeEach(() => {
    gulp.reset()
  })
  describe('getFunc', () => {
    it('should get the task function', () => {
      getFunc('./tasks/noop').should.be.a.Function
      getFunc('should').should.be.a.Function
    })
  })
  describe('register', () => {
    it('should register the local task function to gulp', () => {
      register({
        __task: './tasks/noop',
        __taskName: 'noop'
      })
      gulp.hasTask('noop').should.be.equal(true)
    })
    it('should register the npm module to gulp', () => {
      register({
        __task: 'should',
        __taskName: 'noop'
      })
      gulp.hasTask('noop').should.be.equal(true)
    })

    it('should register a function to gulp', () => {
      var taskFunc = spy()
      register({
        __task: taskFunc,
        __taskName: 'noop'
      })
      gulp.hasTask('noop').should.be.equal(true)
    })
  })
  describe('run', () => {
    it('should run a function registered', (cb) => {
      var taskFunc = stub().returns((done) => done())

      run({
        __task: taskFunc,
        __taskName: 'noop',
        src: '123123'
      }, () =>{
        taskFunc.calledOnce.should.be.equal(true)
        taskFunc.calledWith({src: '123123'}).should.be.equal(true)
        cb()
      })
    })
  })
})
