import through from 'through2'
import gutil from 'gulp-util'

var startTime, name

function start(chunk, enc, cb) {
  cb(null, chunk)
}

function end(cb) {
  var time = new Date() - startTime;
  gutil.log([
    'Timer:',
    gutil.colors.cyan(name),
    'takes',
    gutil.colors.magenta(time > 1000 ? time / 1000 + 's' : time, 'ms')
  ].join(' '))

  cb()
}

export default function timer(taskname) {
  startTime = new Date()
  name = taskname || 'task'

  return through.obj(start, end)
}
