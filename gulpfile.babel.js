import gulp from 'gulp'

import gconf from './src/index'

gconf
.use(gulp)
.loadTasks(
  'clean',
  'copy',
  'browserify',
  'gulp-mocha')

gconf({
  clean: {
    src: 'public'
  },
  copy: {
    src: ['src/*.*']
  },
  'gulp-mocha': {
    src: ['test/**/*.spec.js'],
    ui: 'bdd',
    reporter: 'spec',
    require: ['should']
  }
})
