import { EggAppConfig, PowerPartial } from 'egg'

export default () => {
  const config: PowerPartial<EggAppConfig> = {}
  config.keys = '_1628616862378_8189'
  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'STNews API',
      description: 'api for STNews',
      version: '1.0.0',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
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
  config.proxy = true
  return {
    ...config,
  }
}
