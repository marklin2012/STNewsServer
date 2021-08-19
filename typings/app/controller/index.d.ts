// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/base_controller';
import ExportHome from '../../../app/controller/home';
import ExportPost from '../../../app/controller/post';
import ExportTest from '../../../app/controller/test';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    home: ExportHome;
    post: ExportPost;
    test: ExportTest;
    user: ExportUser;
  }
}
