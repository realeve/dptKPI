# dptKPI

部门履职评价系统

# 初始化

1. 建 2 个数据库，对应初始化 sql 为./src/sql 中解压出的 kpi.sql 与 api.sql 2 个文件(解压密码微信私信)
2. 后台接口处理同时支持 php7 及 php5，此处端口为 90，若有需要自行调整 https://github.com/realeve/thinkPHP

   > 后台需同时调整对应 mysql 用户名密码配置：./application/api/database.php 中设置

3. API 管理前台(二次开发时需要) https://github.com/realeve/api_manager
4. ./src/libs/util.js 中配置好后台接口地址(ajaxUrl)

## Install

```bush
// install dependencies
npm install
```

## Run

### Development

```bush
npm run dev
```

### Production(Build)

```bush
npm run build
```
