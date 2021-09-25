// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/base_controller';
import ExportComment from '../../../app/controller/comment';
import ExportFile from '../../../app/controller/file';
import ExportHome from '../../../app/controller/home';
import ExportNotification from '../../../app/controller/notification';
import ExportPost from '../../../app/controller/post';
import ExportTest from '../../../app/controller/test';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    comment: ExportComment;
    file: ExportFile;
    home: ExportHome;
    notification: ExportNotification;
    post: ExportPost;
    test: ExportTest;
    user: ExportUser;
  }
}
