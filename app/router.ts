import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  router.get('/', controller.home.index)
  router.get('/test/add_user', controller.test.addUserTest)
  router.get('/post/list', controller.post.list)
  // 登录相关
  router.post('/login/password', controller.user.loginWithPassword)
  router.post('/login/pin', controller.user.loginWithPin)
  router.get('/checkcode', controller.user.getCheckCode)
  router.post('/checkcode/verify', controller.user.checkCheckcode)
  router.post('/user/password', controller.user.setPassword)
  // 用户相关
  router.put('/user/update', controller.user.update)
  router.get('/user/info', controller.user.getUserInfo)
  router.put('/user/favourite', controller.user.favouriteUser)
  router.get('/user/favourite/list', controller.user.geFavouriteUsers)
}
