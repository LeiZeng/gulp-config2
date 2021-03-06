#gulp config
```bash
npm install --save-dev gulp-config2
```
##Easier to use
No longer have to write some code, configuration only
```js
import gconf from 'gulp-config2'
gconf.load('gulp-sass')
gconf({
  'gulp-sass': {
    src: 'src/**/*.*',
    dest: 'public',
    // some options
  }
})
```
##Reuse your tasks
If you would like to write some task yourself, it can be exactly the same to the NPM modules
`tasks/myTask.js`
```js
import through from 'through2'
export default function(options) {
  return through.obj(function (chunk, enc, cb) {
    cb(null, dealWithTheChunk(chunk, options))
  })
})
```
`gulpfile.js`
```js
gconf.load('./tasks/myTask')
gconf({
  'myTask': {
    src: 'src/**/*.*',
    dest: 'public',
    // some options
  }
})
```
Try to use src/dest/options through functions


##Usage:
###Add a built-in copy task, `copy` `clean` are ready to use.
```js
gconf.load('copy')
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
###Add a task from a NPM module `gulp-sass`
```js
gconf.load('gulp-mocha')
gconf({
  'gulp-mocha': {
    src: 'src/**/*.spec.js',
    // some options
  }
})
```
It's exactly the same to this gulp task:

```js
gulp.task('gulp-mocha', function () {
  return gulp.src('src/**/*.spec.js')
    .pipe(require('gulp-mocha')(/*some options*/))
})
```

###Add a renamed tasks

```js
gconf.load({
  'custom-copy': './tasks/copy',
  'sass': 'gulp-sass'
})
gconf({
  dest: 'public',
  'custom-copy': {
    src: ['src/**/*.js'],
    dest: 'dist',//overwrote the global dest
  },
  sass: {
    src: ['src/sass/index.scss']
  }
})
```

###Config a task with multiple entries
```js
gconf.load('copy')
gconf({
  'copy': [{
      src: ['src1/**/*.js'],
      dest: 'dist1',
    },{
      src: ['src2/**/*.js'],
      dest: 'dist2',
  }]
})
```

###Add a queue task
```js
gconf.queue({
  mirror: [
    'clean',
    'copy'
  ]
})

gconf({
  mirror: {
    'clean': {
      src: [
        'public/images',
        'public/webfont',
      ]
    },
    'copy': [{
      src: 'src/assets/images',
      dest: 'public/images'
    },{
      src: 'node_modules/webfont/**/*.*',
      dest: 'public/webfont'
    }]
  }
})
```

###Add a pipeline task
```js
gconf.pipelines({
  css: ['gulp-sass', 'gulp-prefix']
})

gconf({
  dest: 'public',
  css: {
    src: 'src/*.css',
    dest: 'dist', //otherwise use the global dest
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
.load('copy', 'browserify', 'gulp-sass', 'gulp-autoprefixer', 'gulp-jshint')

gconf({
  src: ['src/**/*.js'], //for simple projects
  dest: 'dist', //for simple projects
  'gulp-jshint': {
    node: true
  }
})
```

###For complex and bigger projects
Create sub-project rules for special folders like:
src.project.myModule
```js
// TODO
gconf.project('project', {
  default: 'myModule',
  //src: src.project.myModule,
  dest: 'public',
  'project-copy': {
    src: ''
  }
})
```
