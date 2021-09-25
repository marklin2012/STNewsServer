// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAnnouncement from '../../../app/model/announcement';
import ExportBaseModel from '../../../app/model/base_model';
import ExportCategory from '../../../app/model/category';
import ExportComment from '../../../app/model/comment';
import ExportCommentFavourite from '../../../app/model/comment_favourite';
import ExportConfig from '../../../app/model/config';
import ExportNotification from '../../../app/model/notification';
import ExportPost from '../../../app/model/post';
import ExportPostFavourite from '../../../app/model/post_favourite';
import ExportPostThumbup from '../../../app/model/post_thumbup';
import ExportUser from '../../../app/model/user';
import ExportUserFans from '../../../app/model/user_fans';
import ExportUserFavourite from '../../../app/model/user_favourite';

declare module 'egg' {
  interface IModel {
    Announcement: ReturnType<typeof ExportAnnouncement>;
    BaseModel: ReturnType<typeof ExportBaseModel>;
    Category: ReturnType<typeof ExportCategory>;
    Comment: ReturnType<typeof ExportComment>;
    CommentFavourite: ReturnType<typeof ExportCommentFavourite>;
    Config: ReturnType<typeof ExportConfig>;
    Notification: ReturnType<typeof ExportNotification>;
    Post: ReturnType<typeof ExportPost>;
    PostFavourite: ReturnType<typeof ExportPostFavourite>;
    PostThumbup: ReturnType<typeof ExportPostThumbup>;
    User: ReturnType<typeof ExportUser>;
    UserFans: ReturnType<typeof ExportUserFans>;
    UserFavourite: ReturnType<typeof ExportUserFavourite>;
  }
}
