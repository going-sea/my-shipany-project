# ShipAny Template Two

## Preview

![preview](preview.png)
[https://cf-two.shipany.site/](https://cf-two.shipany.site/)

## Doc

[https://www.shipany.ai/zh/docs](https://www.shipany.ai/zh/docs)

## Branch

- `main`: two main branch
- `one/main`: one main branch
- `one/cloudfare`: one cloudfare branch
- `one/nanobanana`: one nanobanana branch [coming soon]

## 常见问题

### .env.example中为什么配置这么少？

答：OAuth、支付、存储等配置都是通过 Admin Settings UI（/admin/settings）在数据库中管理的，而不是通过.env环境变量。


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
