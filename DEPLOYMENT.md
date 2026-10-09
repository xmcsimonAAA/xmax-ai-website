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

- Node.js: 18.x 到 22.x，推荐 Node.js 20 LTS
- npm: 随 Node.js 安装即可
- 推荐系统: macOS / Linux / Windows Server 均可

后端 `package.json` 指定的 Strapi 运行要求为：

```text
node >=18.0.0 <=22.x.x
```

不要使用 Node.js 24 或更新大版本运行 Strapi 后台。即使偶尔能启动，也可能出现后台管理页随机崩溃、依赖编译不稳定等问题。

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

## 8. 生产反向代理与 ALB 路由

如果前端网站和 Strapi 后端共用同一个域名，不能只把 `/admin` 转发给 Strapi。Strapi 管理后台进入内容管理、媒体库、国际化等页面时，还会请求多个不在 `/admin` 下的插件 API。

必须确保以下路径转发到 Strapi 后端，例如 `http://127.0.0.1:1337`：

```text
/admin
/api
/uploads
/content-manager
/content-type-builder
/upload
/i18n
```

前端 SPA 只应该接管其他普通页面路径，例如 `/`。

### 8.1 Nginx 示例

下面示例假设：

- 前端静态文件目录为 `/var/www/xmax-ai/frontend/dist`
- Strapi 后端监听 `127.0.0.1:1337`

```nginx
server {
    listen 80;
    server_name ai.xmax.com;

    root /var/www/xmax-ai/frontend/dist;
    index index.html;

    location ^~ /admin {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ^~ /api {
        proxy_pass http://127.0.0.1:1337;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ^~ /uploads {
        proxy_pass http://127.0.0.1:1337;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ^~ /content-manager {
        proxy_pass http://127.0.0.1:1337;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ^~ /content-type-builder {
        proxy_pass http://127.0.0.1:1337;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ^~ /upload {
        proxy_pass http://127.0.0.1:1337;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ^~ /i18n {
        proxy_pass http://127.0.0.1:1337;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

修改 Nginx 后执行：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 8.2 ALB 路由规则

如果使用 AWS ALB，建议配置两个 target group：

- 前端 target group：静态站点或前端服务
- 后端 target group：Strapi 服务，端口通常为 `1337`

ALB path rules 必须把以下路径转发到后端 target group：

```text
/admin*
/api*
/uploads*
/content-manager*
/content-type-builder*
/upload*
/i18n*
```

默认规则 `/*` 再转发到前端 target group。

### 8.3 部署后路由检查

部署完成后，下面这些请求必须返回 JSON，而不是前端 `index.html`：

```bash
curl -I https://your-domain.com/admin/project-type
curl -I https://your-domain.com/api/home-page?locale=en
curl -I https://your-domain.com/content-manager/content-types
curl -I https://your-domain.com/content-type-builder/content-types
curl -I https://your-domain.com/upload/files
curl -I https://your-domain.com/i18n/locales
```

如果 `/content-manager/...`、`/content-type-builder/...` 或 `/upload/...` 返回 `text/html`，后台会出现 Content Manager 一直加载、媒体库打不开或 “Something went wrong”。

## 9. 多语言与翻译机制

网站默认首次访问显示英文。

用户手动切换中文或英文后，前端会记住用户选择。

后台内容支持中文和英文。当前版本已经改为“后台保存多语言内容，前端只读取当前语言内容”的机制：

- 英文页面请求 Strapi 的 `locale=en`
- 中文页面请求 Strapi 的 `locale=zh-Hans`
- 前端不再在浏览器里临时翻译中文内容
- 前端不再从另一个语言版本里跨语言补文字或补图片
- 图片、URL、图标等非语言字段在后台同步时复制到目标语言；图片字段本身仍按 Strapi i18n 配置尽量保持非本地化共享

这样做的目的是避免线上接口较慢时先显示中文/旧静态文案，再切换成英文文案的闪烁问题。

### 9.1 自动翻译配置

如果甲方后续主要在后台填写中文，并希望自动生成英文内容，后端必须配置 DeepL：

```text
DEEPL_API_KEY=your-deepl-api-key
TRANSLATE_TARGET_LOCALES=zh-Hans,en
```

配置后，管理员在 Strapi 后台更新中文内容时，后端生命周期 hook 会自动生成或更新英文 locale。

### 9.2 手动同步命令

如果已经批量修改了中文内容，可以在后端目录执行：

```bash
cd backend
npm run sync:locales -- --from zh-Hans --to en
```

如果没有 DeepL Key，开发环境可以临时使用内置静态词典：

```bash
cd backend
npm run sync:locales -- --from zh-Hans --to en --static
```

注意：`--static` 只适合已在词典中覆盖的短句和少量固定文案，不适合正式翻译长篇法律文本、新闻稿或新增业务介绍。脚本已经加入保护：静态翻译后仍含中文的字段不会写入英文 locale。

如果本地调试时误把中文写入英文 locale，可以执行一次：

```bash
cd backend
npm run repair:en-content
```

该命令只用于修复当前项目内置的英文基础内容，不替代正式翻译。

注意：Strapi 管理后台界面固定使用英文 Admin UI。这里指的是后台系统菜单、媒体库、Content Manager 等管理界面语言，不影响网站前台中英文内容。

不要把 `backend/src/admin/app.js` 改成强制 `zh-Hans`，也不要添加不完整的后台中文翻译表，否则 Strapi Admin 的内容管理和媒体库页面可能出现 `Cannot read properties of undefined (reading 'sort')` 报错。

如果线上后台用户曾经使用过中文 Admin UI，请在部署后执行一次：

```bash
sqlite3 backend/.tmp/data.db "UPDATE admin_users SET prefered_language='en';"
```

然后重新构建并重启后端：

```bash
cd backend
npm run build
npm run start
```

如果后台进入 About、Business 等内容编辑页时出现以下报错：

```text
components[props.attribute.component].layout
Cannot read properties of undefined (reading 'sort')
```

通常是 Strapi 数据库里的后台 schema 缓存不完整。项目已在后端启动时自动检查并修复组件 schema 缓存；如果线上数据库已经出现该问题，也可以在后端目录手动执行一次：

```bash
cd backend
npm run repair:schema-cache
npm run build
npm run start
```

## 10. 交付建议

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

## 11. GitHub 备份说明

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

## 12. 常用启动顺序

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
