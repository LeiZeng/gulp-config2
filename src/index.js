import path from 'path'

import gutil from 'gulp-util'
import _ from 'lodash'
import th from 'through2'
import vfs from 'vinyl-fs'
import del from 'del'

let gulp

import timer from '../tasks/timer'

const globalConfigDefault = {
  src: 'src/{**/}*.*',
  dest: 'public'
}
const taskListDefault = {
  clean: clean,
  copy: gutil.noop  //a default through
}

let taskList = _.clone(taskListDefault)
let configList = _.clone(globalConfigDefault)

const config = function gulpConfig(conf) {
  gulp = gulp || require('gulp')
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

config.loadPipelines = function loadPipelines(pipelines) {
  return Object.keys(pipelines)
    .map(taskName => {
      return loadPipeline(taskName, pipelines[taskName])
    })
}
config.reset = function reset() {
  taskList = _.clone(taskListDefault)
  configList = _.clone(globalConfigDefault)
  gulp.reset()
  return config
}

function loadTask(taskName, through) {
  if (gulp.hasTask(taskName)) return

  // clean task is special as here
  if (through === clean) {
    return gulp.task(taskName, clean((configList[taskName] && configList[taskName].src) || configList.dest))
  }

  gulp.task(taskName, function () {
    return gulp.src(
        (configList[taskName]
          && configList[taskName].src)
        || configList.src)
      .pipe(through(configList[taskName]))
      .pipe(gulp.dest(
        (configList[taskName]
          && configList[taskName].dest)
        || configList.dest))
      .pipe(timer(taskName))
  })
}

function getTaskPlugin(pluginName) {
    return /\./.test(pluginName)
      ? (taskList[path.basename(pluginName)]
        || require(path.relative(__dirname, path.resolve(pluginName))))
      : (taskList[pluginName]
        || require(pluginName))
}

function getTaskPluginName(pluginName) {
    return /\./.test(pluginName) ?
      path.basename(pluginName) :
      pluginName
}

function loadPipeline(taskName, pipeline) {
  if (gulp.hasTask(taskName)) return

  gulp.task(taskName, (cb) => {
      let st = gulp.src(
        (configList[taskName]
          && configList[taskName].src)
        || configList.src)

      // wrap the pipe line into stream
      if(pipeline && pipeline.length)
        pipeline.forEach(item => {
          var taskConfig = (configList[taskName]
              && configList[taskName][getTaskPluginName(item)])
            ? configList[taskName][getTaskPluginName(item)]
            : null
          st = st.pipe(getTaskPlugin(item)(taskConfig))
        })

      return st.pipe(gulp.dest(
        (configList[taskName]
          && configList[taskName].dest)
        || configList.dest))
        .pipe(timer(taskName))
    })
}

function loadPluginObject(obj) {
  return Object.keys(obj)
    .map(key => {
      return loadPlugin(obj[key], key)
    })
}

function loadPlugin(pluginName, taskName) {
  return /\./.test(pluginName)
    ? loadPluginFromFile(pluginName, taskName)
    : loadPluginModule(pluginName, taskName)
}

function loadPluginModule(moduleName, taskName) {
  // cache the module or load the default tasks
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

function clean(src) {
  return function (cb) {
    del(src, cb)
  }
}

export default config
