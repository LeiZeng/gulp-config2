var gulp

gulp = require('gulp')

const config = function loadConfig(config) {
  return this
}

config.getGulp = function getGulp() {
  return gulp
}

config.use = function useGulp(gulpContext) {
  gulp = gulpContext || gulp
}

config.loadTasks = function loadTasks(task, ...tasks) {

}

export default config
