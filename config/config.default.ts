import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = '_1628616862378_8189'

  // add your egg config in here
  config.middleware = ['auth', 'paging', 'error']

  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'STNews API',
      description: 'api for STNews',
      version: '1.0.0',
      schemes: ['http', 'https'],
      consumes: ['application/x-www-form-urlencoded', 'application/json'],
      produces: ['application/json', 'application/x-www-form-urlencoded'],
      enableSecurity: false,
      // enableValidate: true,
      routerMap: true,
      enable: true,
    },
  }

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/egg-mongo',
      options: {},
    },
  }

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: 'auth',
      db: 0,
    },
  }

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  }

  config.jwt = {
    secret: 'rqeijqp*()',
  }

  config.validate = {}

  config.multipart = {
    mode: 'file',
  }

  // the return config will combines to EggAppConfig
  return {
    ...(config as {}),
    ...bizConfig,
  }
}
