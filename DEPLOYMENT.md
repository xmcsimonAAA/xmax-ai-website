# XMAX AI Website 配置与交付说明

本文档用于说明本项目的本地运行、部署配置、数据库与图片文件位置。

## 1. 项目结构

```text
xmax-ai-website/
  frontend/                 # 官网前端，Vite + React
  backend/                  # 内容管理后台，Strapi 5
  backend/.env              # 后端环境变量，包含密钥，不建议公开上传
  backend/.tmp/data.db      # SQLite 数据库，包含后台内容
  backend/public/uploads/   # Strapi 上传图片与媒体文件
  frontend/public/          # 前端静态资源，例如官网 logo
```

## 2. 环境要求

- Node.js: 18.x 到 22.x
- npm: 随 Node.js 安装即可
- 推荐系统: macOS / Linux / Windows Server 均可

后端 `package.json` 指定的 Strapi 运行要求为：

```text
node >=18.0.0 <=22.x.x
```

## 3. 后端配置

后端目录：

```bash
cd backend
```

安装依赖：

```bash
npm ci
```

开发模式启动：

```bash
npm run develop
```

生产模式构建：

```bash
npm run build
```

生产模式启动：

```bash
npm run start
```

默认后台地址：

```text
http://localhost:1337/admin
```

如果局域网访问，需要把 `localhost` 换成服务器或电脑的局域网 IP，例如：

```text
http://192.168.x.x:1337/admin
```

## 4. 后端环境变量

后端环境变量文件位于：

```text
backend/.env
```

当前项目使用到的变量包括：

```text
HOST
PORT
PUBLIC_URL
APP_KEYS
API_TOKEN_SALT
ADMIN_JWT_SECRET
TRANSFER_TOKEN_SALT
JWT_SECRET
DATABASE_FILENAME
STRAPI_PLUGIN_I18N_INIT_LOCALE_CODE
DEEPL_API_KEY
```

说明：

- `HOST`: 后端监听地址，通常为 `0.0.0.0`
- `PORT`: 后端端口，默认 `1337`
- `PUBLIC_URL`: 后端公开访问地址，部署后建议配置为真实域名或服务器地址
- `DATABASE_FILENAME`: SQLite 数据库路径，当前为 `.tmp/data.db`
- `DEEPL_API_KEY`: DeepL 翻译 API Key；如需后台内容自动翻译，需要配置
- 其他 `*_SECRET` / `*_SALT` / `APP_KEYS`: Strapi 安全密钥，必须保密

不要把 `.env` 上传到公开 GitHub 仓库。

## 5. 数据库与图片

数据库文件：

```text
backend/.tmp/data.db
```

上传图片目录：

```text
backend/public/uploads/
```

交付或迁移时，必须同时复制数据库和 uploads 目录。只复制代码、不复制这两个位置，会导致后台内容或图片丢失。

## 6. 前端配置

前端目录：

```bash
cd frontend
```

安装依赖：

```bash
npm ci
```

开发模式启动：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

本地预览生产版本：

```bash
npm run preview
```

前端开发地址通常为：

```text
http://localhost:5174/
```

实际端口可能由 Vite 自动调整，请以终端输出为准。

## 7. 前端连接后端

前端通过 `VITE_CMS_URL` 指定 Strapi 后端地址。

开发模式下，如果未配置 `VITE_CMS_URL`，前端会使用 Vite 代理。

生产部署时，建议在前端环境变量中配置：

```text
VITE_CMS_URL=https://your-backend-domain.com
```

如果后端部署在同一台服务器但不同端口，也可以配置为：

```text
VITE_CMS_URL=http://your-server-ip:1337
```

配置后需要重新执行：

```bash
npm run build
```

## 8. 多语言与翻译机制

网站默认首次访问显示英文。

用户手动切换中文或英文后，前端会记住用户选择。

后台内容支持中文和英文。考虑到后续维护可能主要填写中文，项目内已加入两层兜底：

- 后端可使用 DeepL API 自动翻译内容，需要配置 `DEEPL_API_KEY`
- 前端包含静态翻译兜底，避免英文页面出现大量中文混杂

## 9. 交付建议

完整可运行交付包建议包含：

```text
frontend/
backend/
backend/.env
backend/.tmp/data.db
backend/public/uploads/
frontend/public/
```

可以不交付或重新安装的目录：

```text
frontend/node_modules/
backend/node_modules/
frontend/dist/
backend/build/
backend/.cache/
backend/.strapi/
.codex-backups/
```

如果交付对象不熟悉 Node.js 和 npm，为了方便原样运行，也可以保留 `node_modules`，但压缩包会明显变大。

## 10. GitHub 备份说明

当前 GitHub 备份分支：

```text
codex/preserve-xmax-work-20260601
```

GitHub 上已包含代码、前端静态资源、Strapi API 结构和 uploads 图片。

出于安全原因，GitHub 备份未包含：

```text
backend/.env
backend/.tmp/data.db
node_modules/
frontend/dist/
```

因此，GitHub 备份不能单独代表完整可运行交付包。完整交付仍应以本地压缩包为准。

## 11. 常用启动顺序

先启动后端：

```bash
cd backend
npm run develop
```

再启动前端：

```bash
cd frontend
npm run dev
```

访问：

```text
前端: http://localhost:5174/
后台: http://localhost:1337/admin
```

