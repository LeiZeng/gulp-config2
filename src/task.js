import path from 'path'

import gulp from 'gulp'
import gutil from 'gulp-util'
import _ from 'ramda'

import config from './config'

// callbackOrNot :: taskFunc -> isCB:Bool -> taskFunc
const callbackOrNot = (func) => {
  return func.length ? (callback) => func(callback) : func
}

// getFuncPath :: -> task -> taskPath
const getFuncPath = (task) => {
  return path.join(process.cwd(), task)
}

// isLocalFunction :: fileName -> Bool
const isLocalFunction = (taskFile) => {
  return taskFile.indexOf('./') > -1
}

// wrapPlaceholder :: Taskfunction -> Taskfunction
const wrapPlaceholder = (func) => {
  return func.length ?
    (callback) => {
      return func(callback)
    } :
    () => {
      return func()
    }
}

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
export const registerTask = (config) => {
  gulp.task(config.taskName, getTaskFunc(config.__task))
  return config
}

// reconfigTask :: config -> config
export const runTask = (config) => {
  return config
}

const log = (item) => {
  console.log(item)
  return item
}
