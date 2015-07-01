import del from 'del'

export default function clean(src) {
  return function (cb) {
    del(src, cb)
  }
}
