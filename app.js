const path = require('path')

class AppBootHook {
  constructor(app) {
    this.app = app
  }
  async didLoad() {
    const directory = path.join(this.app.config.baseDir, 'app/validate')
    this.app.loader.loadToApp(directory, 'validate')
  }
}

module.exports = AppBootHook