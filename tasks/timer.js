import through from 'through2'
import gutil from 'gulp-util'

var startTime

export default function timer(taskname) {
  var gulp = this

  startTime = new Date()

  function start() {}

  function end() {
    var time = new Date() - startTime;

    gutil.log([
      'Timer:',
      gutil.colors.cyan(taskname),
      'takes',
      gutil.colors.magenta(time > 1000 ? time / 1000 + 's' : time, 'ms')
    ].join(' '))
  }

  return through(start).on('end', end)
}
