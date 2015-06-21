var obj = (function () {
  var person = {
    name: '123'
  }
  return {
    run: function (key) {
      return person[key]
    }
  }
})();
