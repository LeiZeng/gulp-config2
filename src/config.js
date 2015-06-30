import _ from 'lodash'

const globalConfigDefault = {
  src: 'src/**/*.*',
  dest: 'public'
}

let configList = _.clone(globalConfigDefault)

const config = function gulpConfig(conf) {
  configList = _.merge(configList, conf)
  return config
}

config.getConf = function getConf(taskName, ...deps) {
  return taskName
    ? (deps && deps.length
      ? deps.reduce((result, key) => {
          return result[key] ? result[key] : result
        }, configList[taskName] || configList)
      : (configList[taskName] || configList))
    : configList
}

config.default = function () {
  configList = _.clone(globalConfigDefault)
  return config
}

export default config
