// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseModel from '../../../app/model/base_model';
import ExportComment from '../../../app/model/comment';
import ExportConfig from '../../../app/model/config';
import ExportPost from '../../../app/model/post';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    BaseModel: ReturnType<typeof ExportBaseModel>;
    Comment: ReturnType<typeof ExportComment>;
    Config: ReturnType<typeof ExportConfig>;
    Post: ReturnType<typeof ExportPost>;
    User: ReturnType<typeof ExportUser>;
  }
}
