import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.get('/', controller.home.index)
  router.get('/test/add_user', controller.test.addUserTest)
  router.get('/post/list', controller.post.list)
};
