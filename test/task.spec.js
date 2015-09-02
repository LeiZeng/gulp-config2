import should from 'should'
import gulp from 'gulp'
import {spy} from 'sinon'

import {
  getTaskFunc,
  registerTask
} from '../src/task'

describe('Task', () => {
  beforeEach(() => {
    gulp.reset()
  })
  describe('getTaskFunc', () => {
    it('should get the task function', () => {
      getTaskFunc('./tasks/noop').should.be.a.Function
      getTaskFunc('should').should.be.a.Function
    })
  })
  describe('registerTask', () => {
    it('should register the local task function to gulp', () => {
      registerTask({
        __task: './tasks/noop',
        taskName: 'noop'
      })
      gulp.hasTask('noop').should.be.equal(true)
    })
    it('should register the npm module to gulp', () => {
      registerTask({
        __task: 'should',
        taskName: 'noop'
      })
      gulp.hasTask('noop').should.be.equal(true)
    })

    it('should register a function to gulp', () => {
      var taskFunc = spy()
      registerTask({
        __task: taskFunc,
        taskName: 'noop'
      })
      gulp.hasTask('noop').should.be.equal(true)
    })
  })
})
