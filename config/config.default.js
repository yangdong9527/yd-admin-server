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

  config.middleware = ['errorHandle', 'auth'];
  const  whiteList= ['/user/register', '/user/login']
  config.auth = {
    enable: whiteList
  }
  // 关闭 csrf
  config.security = {
    csrf: {
      enable: false
    }
  }
  // token 配置
  config.jwt = {
    secret: 'ydtianxiawudidiyishuai',
    expiresIn: 60 * 60 * 1
  }
  // egg-validate 配置
  config.validate = {
    convert: true, // 对参数进行隐士转换
    validateRoot: false // 校验是否一定要是对象 
  }
  // egg-mysql 配置
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'admin'
    },
    app: true,
    agent: false
  }
  // egg-cors 配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  };

  // add your user config here
  const userConfig = {
    whiteList
  };

  return {
    ...config,
    ...userConfig,
  };
};