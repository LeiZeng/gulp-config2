import path from 'path'

import gutil from 'gulp-util'
import _ from 'lodash'
import merge from 'merge-stream'
import vfs from 'vinyl-fs'

let gulp = require('gulp')

import gconf from './config'
import timer from '../tasks/timer'
import clean from '../tasks/clean'

const taskListDefault = {
  clean: clean,
  copy: gutil.noop  //a default through
}
const IsCustomFile = /\./

let taskList = _.clone(taskListDefault)

gconf.getGulp = function getGulp() {
  return gulp
}

gconf.use = function useGulp(gulpContext) {
  gulp = gulpContext || gulp
  return gconf
}

gconf.load = function load(tasks, ...others) {
  if (_.isString(tasks)) {
    loadTask(loadPlugin(tasks))
  } else if (_.isObject(tasks)) {
    loadPluginObject(tasks)
  }

  if (others && others.length) {
    others.filter(task => {
      return _.isString(task)
    })
    .map(task => {
      return loadTask(loadPlugin(task))
    })
  }

  return gconf
}

gconf.pipelines = function pipelines(pipelines) {
  return Object.keys(pipelines)
    .map(taskName => {
      return loadPipeline(taskName, pipelines[taskName])
    })
}
gconf.reset = function reset() {
  taskList = _.clone(taskListDefault)
  this.default()
  gulp.reset()
  return gconf
}

function loadTask(obj) {
  if (gulp.hasTask(obj.taskName)) return

  // clean task is special as here
  if (obj.modules[obj.taskName] === clean) {
    return gulp.task(obj.taskName,
      clean(gconf.getConf(obj.taskName, 'src') || gconf.getConf('dest')))
  }

  return gulp.task(obj.taskName, function() {
    var conf = gconf.getConf(obj.taskName)

    // enable multiple entries
    conf = _.isArray(conf) ? conf : [conf]

    return merge.apply(gulp, conf.map(config => {
      var src = gulp.src(config.src, config.srcOption)

      // enable pipelines
      Object.keys(obj.modules)
        .filter(key => {
          return _.isFunction(obj.modules[key])
        })
        .map(key => {
          src = src.pipe(obj.modules[key](config[key] || config))
        })

      src = src.on('error', gutil.log)

      if (config.dest) {
        src = src.pipe(gulp.dest(config.dest, config.destOption))
      }

      if (gulp.isWatching) {
        src = src.pipe(timer(obj.taskName))
      }

      return src
    }))
  })
}

function getTaskPlugin(pluginName) {
    return IsCustomFile.test(pluginName)
      ? (taskList[path.basename(pluginName)]
        || require(path.relative(__dirname, path.resolve(pluginName))))
      : (taskList[pluginName]
        || require(pluginName))
}

function getTaskPluginName(pluginName) {
    return IsCustomFile.test(pluginName) ?
      path.basename(pluginName) :
      pluginName
}

function loadPipeline(taskName, pipeline) {
  if (gulp.hasTask(taskName)) return

  var obj = {
    taskName: taskName,
    modules: {}
  }

  // wrap the pipe line into stream
  if(pipeline && pipeline.length) {
    pipeline.forEach(item => {
      _.merge(obj.modules, loadPlugin(item))
    })
  }
  return loadTask(obj)
}

function loadPluginObject(obj) {
  return Object.keys(obj)
    .map(key => {
      return loadTask(loadPlugin(obj[key], key))
    })
}

function loadPlugin(pluginName, taskName) {
  return IsCustomFile.test(pluginName)
    ? loadFromFile(pluginName, taskName)
    : loadModule(pluginName, taskName)
}

function loadModule(moduleName, taskName) {
  taskName = taskName || moduleName
  // cache the module or load the default tasks
  taskList[taskName] = taskList[taskName]
    || require(moduleName)

  var obj = {
    taskName: taskName,
    modules: {}
  }
  obj.modules[taskName] = taskList[taskName]

  return obj
}

function loadFromFile(fileName, taskName) {
  var relative = path.relative(__dirname, path.resolve(fileName))

  return loadModule(relative, taskName
    || path.basename(fileName))
}

export default gconf
