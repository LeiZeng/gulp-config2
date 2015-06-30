import gulp from 'gulp'

import gconf from './src/index'

gconf
.use(gulp)
.load(
  'clean',
  'copy')
.load({
  mocha: 'gulp-mocha',
  lint: 'gulp-eslint'
})

gconf({
  clean: {
    src: 'public'
  },
  copy: [{
      src: ['src/*.*']
    },{
      src: ['test/test.scss']
  }],
  mocha: {
    src: ['test/**/*.spec.js'],
    ui: 'bdd',
    reporter: 'spec',
    require: ['should']
  },
  lint: {
    "ecmaFeatures": {
      "blockBindings": true,
      "forOf": true,
      "jsx": true
    },
    "rules": {
      "semi": 2
    }
  }
})
