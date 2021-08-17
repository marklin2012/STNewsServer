// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportPaging from '../../../app/middleware/paging';

declare module 'egg' {
  interface IMiddleware {
    paging: typeof ExportPaging;
  }
}
