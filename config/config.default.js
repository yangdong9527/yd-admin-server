/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1585643135616_6164';

  // add your middleware config here
  config.middleware = ['errorHandle'];

  config.security = {
    csrf: {
      enable: false
    }
  }
  
  config.validate = {
    convert: true, // 对参数进行隐士转换
    validateRoot: false // 校验是否一定要是对象 
  }
  config.mysql = {
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'admin'
    },
    app: true,
    agent: false
  }
  
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
