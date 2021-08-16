# 导航

- [技术栈](#技术栈)
- [系统必装依赖](#系统必装依赖)(安装必看 👏)
- [如何安装](#如何安装)(安装必看 👏)
- [开发常用命令](#开发常用命令)(编码必看 ⌨️)
- [项目目录结构](#项目目录结构)(编码必看 ⌨️)
- [分支规范](#分支规范)(编码必看 ⌨️)
- [代码提交](#代码提交)(编码必看 ⌨️)
- [如何开发接口](#如何开发接口)(编码必看 ⌨️)(待补充)

# 技术栈

- Node.js
- MongoDB
- TypeScript
- egg.js
- Koa

# 系统必装依赖

- [Node.js 14+](https://nodejs.org/zh-cn/)
- [nrm](https://github.com/Pana/nrm) (管理 node 源)
- [Yarn](https://yarnpkg.com/)
- [MongoDB 5.0](https://docs.mongodb.com/guides/server/install/)

## 安装 MongoDB-5.0 (macOS)
1. 需要先安装 xcode 工具

```ssh
xcode-select --install
```

2. 安装 mongodb 5.0

```ssh

brew tap mongodb/brew
brew install mongodb-community@5.0

```

3. 启动 mondb 服务

```ssh
brew services start mongodb-community@5.0
```

# 如何安装

1. 安装系统依赖
  请按照上述的清单安装，版本符合要求即可

2. 安装并配置 yarn
  > yarn
  > 不要使用 npm!

```bash
brew install yarn
```

3. nrm 使用 淘宝源

```bash
nrm use taobao
```

4. 下载项目代码
  
5. 安装依赖

```bash
yarn
```

6. 启动项目

```bash
yarn dev
```


# 开发常用命令


```bash
yarn dev      # 开发以启动项目
```

# 项目目录结构


```bash
.
├── package.json
├── app
│   ├── router.js               # 路由配置
│   ├── controller
│   |   └── home.js
│   └── service (可选)
│       └── user.js
├── config
│   ├── plugin.js
│   ├── config.default.js
│   ├── config.prod.js
│   └── config.local.js (可选)
└── test
    ├── middleware
    |   └── response_time.test.js
    └── controller
        └── home.test.js
```

# 分支规范

提交的格式为：`<type>: <subject>`，type用于说明 commit 的类别，subject是 commit 原因的简短描述，type可以使用如下类别：

| commit 前缀      | 说明     |
| ------------- | -------- |
| **init:**     | 项目初始化 |
| **feat:**     | 增加新功能 |
| **fix:**      | 修补bug   |
| **doc:**      | 修改文档   |
| **change:**   | 不影响代码功能的变动   |
| **refactor:** | 对某个功能进行了重构   |
| **test:**     | 增加测试   |
| **chore:**     | 构建过程或辅助工具的变动   |

> 比如我在工程里新增了一个组件， commit 的格式就是 feat:新增XX组件

# 代码提交

（待部署提交语法检查）~~代码提交前会**自动**检查代码语法，检查不过关会提交失败。~~

需要注意：

- 检查每行被 staged 的代码，不要提交无关重要的代码！
- 不要提交无意义的 `print()`
- 合并代码时记得通过提 PR 的方式，并且 assign 给管理员：


# 如何开发接口

1. 创建 Model， 定义数据结构
2. 创建 controller 文件，编写业务逻辑
3. 在 `router.ts` 里给 API 添加路由

具体操作如下（以 testUser 为例）:

## 1. 创建 Model，定义数据结构

在 `app/model/` 下新建 `user.ts` 文件

定义 Model 时，注意以下几点：

1. 必填字段，需加上 `required: true`
2. 对于需要被检索的字段，需加上索引 `index: true`
3. 如果该数据可以被删除，需加上 `deleted` 字段

## 2. 创建 controller 文件，编写业务逻辑

在 `app/controller/` 下新建 `user.ts`, 并实现业务逻辑

## 3. 在 `router.ts` 里给 API 添加路由

在 `app/router.ts` 文件内添加接口路由

例如： 

```js
router.get('/test/adduser', controller.user.addUserTest)
```



