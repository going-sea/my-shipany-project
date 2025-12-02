# ShipAny Template Two

## Preview

[https://cf-two.shipany.site/](https://cf-two.shipany.site/)

## 由于多次发生仓库被提交脏代码，给其他人带来不便，现将仓库写权限关闭，仓库成员仅可读！

## Doc

[✨Shipany官方文档 作者已更新完](https://www.shipany.ai/zh/docs)

[✨Shipany按照官方文档一步步走过程记录](https://github.com/boomer1678/shipany-template/issues/2)

[✨Shipany更新日志](https://github.com/boomer1678/shipany-template/issues/3)

[✨ShipAnyTwo架构要点总结](https://github.com/boomer1678/shipany-template/issues/1)

## Branch

- `main`: two main branch
- `cloudfare`: two cloudfare branch
- `one/main`: one main branch (2025-08-06(v2.6.0))
- `one/cloudfare`: one cloudfare branch 

## 常见问题

### .env.example中为什么配置这么少？

答：OAuth、支付、存储等配置都是通过 Admin Settings UI（/admin/settings）在数据库中管理的，而不是通过.env环境变量。<br/>
所有OAuth、支付、存储的高级配置都通过管理界面完成：
1. 启动应用后访问 http://localhost:3000/admin/settings
2. 使用管理员账号登录
3. 在对应的标签页填写配置信息
4. 保存后配置立即生效，无需重启应用

### 官方文档为什么内容那么少？

答：[官方文档](https://www.shipany.ai/zh/docs) 作者2025-11-24已补全所有文档，各位在开发时可以参阅，预祝各位出海发大财！

### Cloudflare分支须知

Cloudflare分支代码可以部署到Cloudflare，但是需要购买Cloudflare每月$5的套餐才能使用，否则会因为文件打包大小超过3MB而导致线上构建失败。

### Two 与 One 有什么区别？
答：<br/> 
- Two已实现订阅续费自监听和自动发放积分功能；<br/>
- Two内置Al图片生成器、AI 聊天机器人、Al 音乐生成器；<br/>
- Two基础功能：后台管理系统（CMS、RBAC等）、用户中心User Console、配置话Landing Page;<br/>
- Two支付功能：支持Stripe、Creem、Paypal三种收款渠道（Stripe已支持支付宝、微信收款方式）；

## Getting Started

1. Clone code and install

```shell
git clone git@github.com:boomer1678/shipany-template.git -b dev my-shipany-project
cd my-shipany-project
pnpm install
```

2. Set local development env

create `.env` file under root dir

```shell
cp .env.example .env
```

update env with DATABASE_URL and AUTH_SECRET

`DATABASE_URL` may like:

```shell
postgresql://user:password@host:port/db
```

`AUTH_SECRET` can be generated:

- [Generate Auth Secret](https://www.better-auth.com/docs/installation)

3. Create database tables with orm migrate

```shell
pnpm db:generate
pnpm db:migrate
```

4. Start dev server

```shell
pnpm dev
```

5. Deploy to vercel

push code to github and deploy to Vercel.
