import _ from 'ramda'

const DefaultConfig = {
  src: 'src/**/*.*',
  dest: 'public'
}

// resetToDefault :: object -> object
const resetToDefault = _.merge(_.__, DefaultConfig)

let configuration = resetToDefault({})

//* config :: configuration -> config
const config = (conf) => {
  configuration = _.merge(configuration, conf)
  return config
}

//* config.reset :: void -> config
config.reset = () => {
  configuration = resetToDefault({})
  return config
}

//* config.set :: configuration -> config
config.set = config

//* config.get :: key/keyPath -> config
config.get = (keyPath) => {
  return getMapByPath(keyPath, configuration)
}

const log = (item) => {
  console.log(item)
  return item
}
const pathToArray = _.compose(
  _.ifElse(_.isArrayLike, _.identity, _.of),
  _.split('.')
)
const getMapByPath = _.curry((path, map) => {
  return path ? _.path(pathToArray(path), map) : map
})

config.log = log
config.getMapByPath = getMapByPath

export default config
