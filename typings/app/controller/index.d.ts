// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/base_controller';
import ExportComment from '../../../app/controller/comment';
import ExportCommentMoment from '../../../app/controller/comment_moment';
import ExportFeedback from '../../../app/controller/feedback';
import ExportFile from '../../../app/controller/file';
import ExportHome from '../../../app/controller/home';
import ExportMoment from '../../../app/controller/moment';
import ExportNotification from '../../../app/controller/notification';
import ExportPost from '../../../app/controller/post';
import ExportSearch from '../../../app/controller/search';
import ExportTest from '../../../app/controller/test';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    comment: ExportComment;
    commentMoment: ExportCommentMoment;
    feedback: ExportFeedback;
    file: ExportFile;
    home: ExportHome;
    moment: ExportMoment;
    notification: ExportNotification;
    post: ExportPost;
    search: ExportSearch;
    test: ExportTest;
    user: ExportUser;
  }
}
