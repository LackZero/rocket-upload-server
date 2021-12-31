# rocket-upload-server

底层上传文件服务

## Run

1. install

```bash
$ yarn
```

> 为了更好的开发体验，建议本地开发环境 node 版本>=10

2. generate config

```bash
$ npm run build:dev
```

3. run

```bash
$ npm run start:dev
```

## 项目框架介绍

```bash
.
├── README.md
├── apidoc # apidoc生成的静态资源文件
├── apidoc.json
├── assets # 本地存储截图资源文件夹
├── babel.config.js
├── commitlint.config.js # 提交规范配置
├── config # 项目配置文件
│   ├── config.yaml
│   ├── database-config # 数据库 mysql 的配置文档
│   └── pm2-config # pm2 的配置文件
├── index.js # 服务启动文件
├── package.json
├── scripts # 脚本文件
│   └── generateConfig.js
├── src # 服务代码目录
│   ├── apidocs # apidoc 中的一些变量定义以及历史api
│   ├── controllers # 操作层目录
│   ├── index.js # 服务入口文件
│   ├── models # 提供模型文件 以及 初始化sql脚本，也可以自己运行models下的init.js文件
│   ├── middlewares # 中间件
│   ├── routes # 路由目录
│   ├── services # 业务层目录
│   ├── utils # 工具类目录
│   └── validators # 校验器
└── yarn.lock
```

## 介绍

基于 node 端的上传文件服务，用来搭建后端体系

目前支持功能：

- TODO 待补充

更多待支持功能查看[TODO](https://github.com/LackZero/rocket-upload-server/projects/1)

## api 接口文档

使用[apidoc](https://github.com/apidoc/apidoc)作为 API 文档工具是，通过源代码中的 API 注释创建文档。快速上手可参考：[apiDoc - 超简单的文档生成器](https://zhuanlan.zhihu.com/p/83487114)，更多文档请查看[官网](https://apidocjs.com/)

1. 生成文档静态资源

```bash
$ npm run apidoc
```

2. 打开文档链接

```bash
$ npm run start
```

访问：`http://localhost:4000/rocket-upload-server/apidoc/index.html`
