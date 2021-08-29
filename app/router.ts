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
  router.post('/user/password', controller.user.setPassword)
  // 用户权限相关
  router.post('/user/password/modify', controller.user.changePassword)
  router.post('/user/delete', controller.user.delete)
  router.get('/user/info', controller.user.getUserInfo)
  router.post('/user/modify', controller.user.modify)
}
