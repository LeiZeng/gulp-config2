var gulp
var config

beforeEach(()=> {
  gulp = require('gulp')
  config = require('../src/index')
})
afterEach(()=> {
  gulp = null
  config = null
})
describe('Config', ()=> {
  it('should be able to use a gulp context', ()=> {
    config.getGulp().should.not.be.equal(gulp)
    config.use(gulp).getGulp().should.be.equal(gulp)
  })
})
