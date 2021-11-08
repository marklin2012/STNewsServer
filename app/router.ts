import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  router.get('/', controller.home.index)
  router.get('/test/add_user', controller.test.addUserTest)

  // 登录相关
  router.post('/login/password', controller.user.loginWithPassword)
  router.post('/login/pin', controller.user.loginWithPin)
  router.get('/checkcode', controller.user.getCheckCode)
  router.post('/checkcode/verify', controller.user.checkCheckcode)
  router.post('/user/password', controller.user.setPassword)
  router.post('/user/forget/password', controller.user.setForgetPassword)
  // 用户相关
  router.put('/user/update', controller.user.update)
  router.get('/user/info', controller.user.getUserInfo)
  router.put('/user/favourite', controller.user.favouriteUser)
  router.get('/user/favourite/list', controller.user.geFavouriteUsers)
  router.get('/user/favourite/post', controller.user.getFavouritePosts)
  // 文章相关
  router.post('/post/add', controller.post.add)
  router.get('/post/list', controller.post.list)
  router.get('/post/banner', controller.post.bannerList)
  router.get('/post/:_id', controller.post.getPostById)
  router.get('/post/favourite/:_id', controller.post.isFavouritePost)
  router.put('/post/favourite', controller.post.favouritePost)
  router.put('/post/thumbup', controller.post.thumbupPost)
  router.get('/post/thumbup/:_id', controller.post.isThumbupPost)
  // 评论相关
  router.post('/comment/add', controller.comment.addComment)
  router.post('/comment/favourite', controller.comment.favouriteComment)
  router.get('/comment/list', controller.comment.getCommentList)
  // 上传
  router.post('/file/upload', controller.file.uploadFile)
  // 消息提醒
  router.post('/annoucement/add', controller.notification.addAnnouncement)
  router.get('/notify/list', controller.notification.getUserNotify)
  router.put('/notify/readed', controller.notification.notifyReaded)
  // 反馈
  router.post('/feedback', controller.feedback.feedback)
  // 搜索
  router.get('/search', controller.search.search)
  router.get('/search/moment', controller.search.searchMoment)
  router.get('/search/moment/hot', controller.search.momentHotKeys)
  // 圈子
  router.post('/moment/add', controller.moment.add)
  router.get('/moment/list', controller.moment.list)
  router.get('/moment/:_id', controller.moment.getMomentById)
  router.put('/moment/favourite', controller.moment.favouriteMoment)
  router.put('/moment/thumbup', controller.moment.thumbupMoment)
  router.get('/moment/thumbup/:_id', controller.moment.isThumbupMoment)
  router.get('/moment/favourite/:_id', controller.moment.isFavouriteMoment)
  // 圈子评论
  router.post('/comment_moment/add', controller.commentMoment.addComment)
  router.get('/comment_moment/list', controller.commentMoment.getCommentList)
  router.post(
    '/comment_moment/favourite',
    controller.commentMoment.favouriteComment
  )
}
