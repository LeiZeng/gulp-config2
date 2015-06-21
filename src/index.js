import path from 'path'
import gutil from 'gulp-util'

import _ from 'lodash'
import vfs from 'vinyl-fs'

let gulp = require('gulp')

const globalConfigDefault = {
  src: 'src/{**/}*.*',
  dest: 'public'
}
const taskListDefault = {
  copy: gutil.noop //a default through
}

let taskList = _.clone(taskListDefault)
let configList = _.clone(globalConfigDefault)

const config = function gulpConfig(conf) {
  configList = _.merge(configList, conf)
  return config
}

config.getGulp = function getGulp() {
  return gulp
}

config.getConf = function getConf() {
  return configList
}

config.use = function useGulp(gulpContext) {
  gulp = gulpContext || gulp
  return config
}

config.loadTasks = function loadTasks(tasks, ...others) {
  if (_.isString(tasks)) {
    loadPlugin(tasks)
  } else if (_.isObject(tasks)) {
    loadPluginObject(tasks)
  }

  if (others && others.length) {
    others.filter(task => {
      return _.isString(task)
    })
    .map(task => {
      return loadPlugin(task)
    })
  }

  return config
}

config.reset = function reset() {
  taskList = _.clone(taskListDefault)
  configList = _.clone(globalConfigDefault)
  gulp.reset()
  return config
}

function loadTask(taskName, th) {
  if (gulp.hasTask(taskName)) return

  gulp.task(taskName, function () {
    return gulp.src(configList[taskName].src
      || configList.src)
      .pipe(th(configList[taskName]))
      .pipe(configList[taskName].dest
        || configList.dest)
  })
}

function loadPluginObject(obj) {
  return Object.keys(obj)
    .map(key => {
      return loadPlugin(obj[key], key)
    })
}

function loadPlugin(pluginName, taskName) {
  return /\./.test(pluginName) ?
    loadPluginFromFile(pluginName, taskName) :
    loadPluginModule(pluginName, taskName)
}
function loadPluginModule(moduleName, taskName) {
  taskList[moduleName] = taskList[moduleName]
    || require(moduleName)
  loadTask(taskName || moduleName, taskList[moduleName])
}

function loadPluginFromFile(fileName, taskName) {
  taskName = taskName || path.basename(fileName)
  var pathname = path.resolve(fileName)
  var relative = path.relative(__dirname, pathname)
  taskList[taskName] = taskList[taskName]
    || require(pathname)
  loadTask(taskName, taskList[fileName])
}

export default config
