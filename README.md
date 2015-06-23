#gulp config

##Easier to use
No longer have to write some code, configuration only

##Reuse your tasks
If you would like to write some task yourself, it's exactly the same the NPM modules to config

Try to use src/dest/options through functions

##Quickly setup
Install the modules and config them

##Target usage:
###Add a default copy task
```js
gconf.loadTasks('copy')
gconf({
  src: 'src/**/*.*',
  dest: 'public'
})
```
It's exactly the same to this gulp task:
```js
gulp.task('copy', function () {
  return gulp.src('src/**/*.*')
    .pipe(gulp.dest('public'))
})
```
###Add a task from a module sass
```js
gconf.loadTasks('gulp-sass')
gconf({
  'gulp-sass': {
    src: 'src/**/*.*',
    dest: 'public',
      // sometions
  }
})
```
It's exactly the same to this gulp task:

```js
gulp.task('gulp-sass', function () {
  return gulp.src('src/**/*.*')
    .pipe(require('gulp-sass')(/*sometions*/))
    .pipe(gulp.dest('public'))
})
```
###Add a pipeline task
```js
gconf.loadPipelines({
  css: ['gulp-sass', 'gulp-prefix']
})

gconf({
  css: {
    src: 'src/*.css',
    dest: 'public', //or use the global dest
    'gulp-sass': {
      // options
    },
    'gulp-prefix': {
      // options
    }
  }
})
```
It's exactly the same to this gulp task:

```js
gulp.task('css', function () {
  return gulp.src('src/*.css')
    .pipe(require('gulp-sass')(/*sometions*/))
    .pipe(require('gulp-prefix')(/*sometions*/))
    .pipe(gulp.dest('public'))
})
```
###Add multiple tasks

```js
gconf
.loadTasks('copy', 'browserify', 'gulp-sass', 'gulp-autoprefixer', 'gulp-jshint')
.loadTasks({
  'custom-copy': './tasks/copy'
})

gconf({
  src: ['src/**/*.js'], //for simple projects
  dest: 'dist', //for simple projects
  'gulp-jshint': {
    node: true
  }
})

// TODO
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
