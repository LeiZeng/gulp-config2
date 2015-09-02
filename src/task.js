import path from 'path'

import gulp from 'gulp'
import gutil from 'gulp-util'
import _ from 'ramda'

import config from './config'

// callbackOrNot :: taskFunc -> isCB:Bool -> taskFunc
const callbackOrNot = _.curry((task, isCB) => {
  return isCB ? (callback) => task(callback) : task
})

// getFuncPath :: -> task -> taskPath
const getFuncPath = _.curry((task) => {
  return path.join(process.cwd(), task)
})

// isLocalFunction :: fileName -> Bool
const isLocalFunction = _.curry((taskFile) => {
  return taskFile.indexOf('./') > -1
})

// getTaskFunc :: fileName -> gulpTaskFunc
export const getTaskFunc = _.ifElse(_.is(Function),
  _.identity,
  _.compose(
    require,
    _.ifElse(isLocalFunction, getFuncPath, _.identity)
  )
)

// registerTask :: config -> config
export const registerTask = _.curry((config) => {
  gulp.task(config.taskName, getTaskFunc(config.__task))
  return config
})

// reconfigTask :: config -> config
export const runTask = _.curry((config) => {
  return config
})

const log = _.curry((item) => {
  console.log(item)
  return item
})
