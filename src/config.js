import _ from 'ramda'

const globalConfigDefault = {
  src: 'src/**/*.*',
  dest: 'public'
}

let configList = _.clone(globalConfigDefault)

const config = function gulpConfig (conf) {
  configList = _.merge(configList, conf)
  return config
}

config.getConf = function getConf (taskName, ...deps) {
  // prepare deps when some task name is 'css.clean'
  if (taskName && taskName.indexOf('.')) {
    deps = taskName.split('.').splice(1).concat(deps)
    taskName = taskName.split('.').shift()
  }
  let prev = configList
  return taskName
    ? (deps && deps.length
      ? deps.reduce((result, key) => {
        if (result) {
          prev = result
        }
        if (result && result[key]) {
          return result[key]
        } else if (prev) {
          return prev[key]
        }
        return null
      }, configList[taskName])
    : (configList[taskName] || configList))
  : configList
}

config.default = config.reset = function () {
  configList = _.clone(globalConfigDefault)
  return config
}

export default config
