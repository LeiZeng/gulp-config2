import path from 'path'

import gulp from 'gulp'
import gutil from 'gulp-util'
import _ from 'ramda'

import config from './config'
import runTask from './runTask'

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

// getFunc :: fileName -> (gulpTaskFunc -> func)
export const getFunc = _.compose(
  // wrapPlaceholder,
  _.identity,
  _.ifElse(_.is(Function),
    _.identity,
    _.compose(
      require,
      _.ifElse(isLocalFunction, getFuncPath, _.identity)
    )
  )
)

// run :: config -> config
export const run = _.curry((config, cb) => {
  let {
    __taskName,
    __task,
    ...options
  } = config
  return _.pipe(
    getFunc(__task),
    _.curry(runTask)(_.__, cb)
  )(options)
})

// register :: config -> config
export const register = (config) => {
  gulp.task(config.__taskName, getFunc(config.__task))
  return config
}


const log = (item) => {
  console.log(item)
  return item
}
