import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router, jwt } = app

  router.get('/', controller.home.index)
  router.get('/test/add_user', controller.test.addUserTest)
  router.get('/post/list', controller.post.list)
  router.post('/user/loginWithPwd', controller.user.loginWithPassword)
  router.post('/user/loginWithPin', controller.user.loginWithPin)
  router.post('/user/changePassword', jwt, controller.user.changePassword)
  router.post('/user/delete', jwt, controller.user.delete)
}
