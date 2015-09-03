import path from 'path'

import gulp from 'gulp'
import gutil from 'gulp-util'
import _ from 'ramda'

import config from './config'

// callbackOrNot :: taskFunc -> isCB:Bool -> taskFunc
const callbackOrNot = _.curry((func) => {
  return func.length ? (callback) => func(callback) : func
})

// getFuncPath :: -> task -> taskPath
const getFuncPath = _.curry((task) => {
  return path.join(process.cwd(), task)
})

// isLocalFunction :: fileName -> Bool
const isLocalFunction = _.curry((taskFile) => {
  return taskFile.indexOf('./') > -1
})

// wrapPlaceholder :: Taskfunction -> Taskfunction
const wrapPlaceholder = _.curry((func) => {
  return func.length ?
    (callback) => {
      return func(callback)
    } :
    () => {
      return func()
    }
})

// getTaskFunc :: fileName -> gulpTaskFunc
export const getTaskFunc = _.compose(
  wrapPlaceholder,
  _.ifElse(_.is(Function),
    _.identity,
    _.compose(
      require,
      _.ifElse(isLocalFunction, getFuncPath, _.identity)
    )
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
