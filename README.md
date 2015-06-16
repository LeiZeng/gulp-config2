#gulp confog

##Easier to use

##Reuse your tasks

##Quickly setup
##Target usage:
```js
import gulp from 'gulp'
import config from 'gulp-config2'

config
.use(gulp)
.loadTasks(
  'task/jshint',
  {"custom-copy": 'task/copy'},
  {'mocha': '/path/to/mocha'},
  {queue:
    ['custom-copy', 'mocha']
  }
)

config({
  src: ['src/{**/}*.js'], //for simple projects
  dest: 'dist', //for simple projects
  jshint: {
    node: true
  }, //configuration for gulp-jshint
  'custom-copy': [
    {
      src: 'src/images', //overwrite the global src
      dest: '<%=dest%>/assets/images'
    }, //configuration for copy
    {
      src: 'src/index.html',
    }
  ]
})
//for complex projects
// create sub-module rules like in a folder:
// src.theme.myModule
config.subModule('theme', {
  default: 'myModule',
  //src: src.theme.myModule,
  dest: 'public',
  'theme-copy': {
    src: ''
  }
})
```
