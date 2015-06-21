#gulp config

##Easier to use

##Reuse your tasks

##Quickly setup
##Target usage:
```js
gconf
.loadTasks('copy', 'browserify', 'gulp-sass', 'gulp-prefix', 'gulp-ignore')
.loadTasks({
  'custom-copy': './tasks/copy'
})
.loadPipelines({
  css: ['gulp-sass', 'gulp-prefix']
})

gconf({
  css: {
    src: 'src/*.css',
    dest: 'public',
    'gulp-sass': {

    }
  }
})

gconf({
  src: ['src/{**/}*.js'], //for simple projects
  dest: 'dist', //for simple projects
  jshint: {
    node: true
  }, //configuration for gulp-jshint
i    {
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
gconf.subModule('theme', {
  default: 'myModule',
  //src: src.theme.myModule,
  dest: 'public',
  'theme-copy': {
    src: ''
  }
})
```
```js
import gconf from 'gulp-config2'

```
