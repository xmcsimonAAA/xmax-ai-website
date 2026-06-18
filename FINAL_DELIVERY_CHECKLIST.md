# XMAX AI Website 最终交付清单

本文档用于最终打包交付前自检。项目根目录为：

```text
xmax-ai-website/
```

## 1. 当前验收结论

当前版本已经通过本地交付前基础验证：

- 前端 `npm run build` 通过。
- 后端 `npm run build` 通过。
- 本地前端首页可访问。
- 本地 Strapi 后台可访问。
- Strapi 英文内容 API 与中文内容 API 均可正常返回。
- 后台 Content Manager 的语言保持、layout 保护、菜单空数据保护补丁已经纳入自动脚本。

因此当前版本可以作为交付候选版给甲方部署验收。

## 2. 必须交付的内容

源码部署包建议包含以下内容：

```text
xmax-ai-website/
  frontend/
  backend/
  DEPLOYMENT.md
  FINAL_DELIVERY_CHECKLIST.md
  .nvmrc
```

其中以下文件和目录尤其不能漏：

```text
backend/.env
backend/.nvmrc
backend/package.json
backend/package-lock.json
backend/src/
backend/config/
backend/database/
backend/scripts/
backend/types/
backend/public/uploads/
backend/.tmp/data.db

frontend/package.json
frontend/package-lock.json
frontend/src/
frontend/public/
frontend/index.html
frontend/dist/
```

说明：

- `backend/.tmp/data.db` 是当前 SQLite 数据库，包含后台内容与管理员数据。
- `backend/public/uploads/` 是 Strapi 上传图片和媒体目录，当前约 293MB，约 578 个文件。
- 只交付代码、不交付数据库和 uploads，会导致后台内容或图片缺失。
- `frontend/dist/` 是当前前端构建产物，体积很小，可以一起带上；但正式部署仍建议甲方按文档重新执行 `npm ci` 和 `npm run build`。

## 3. 不建议交付的内容

以下目录体积大或属于本机开发缓存，不建议放进最终压缩包：

```text
.git/
.codex-backups/
frontend/node_modules/
backend/node_modules/
frontend/.screenshots/
backend/.strapi/
backend/build/
```

说明：

- `node_modules` 应由甲方服务器通过 `npm ci` 重新安装。
- `backend/build` 是 Strapi 后台构建产物，甲方部署时执行 `npm run build` 会重新生成。
- `.git` 是否交付取决于甲方是否需要完整 Git 历史；普通交付包不需要。

## 4. 数据库备份文件处理

当前 `backend/.tmp/` 里除 `data.db` 外还有若干备份文件，例如：

```text
data.db.bak-*
data.seeded-no-media.db
```

正式部署只需要：

```text
backend/.tmp/data.db
```

备份文件可以另行保存，但不建议混在正式部署包里，避免甲方误用旧数据库。

## 5. 环境变量注意事项

`backend/.env` 内包含 Strapi 密钥，必须通过私有方式交付，不要上传到公开 GitHub。

如果甲方只是复现当前交付版本，可以先使用当前 `.env`。

如果甲方要正式生产上线，建议甲方替换以下变量为新的强随机值：

```text
APP_KEYS
API_TOKEN_SALT
ADMIN_JWT_SECRET
TRANSFER_TOKEN_SALT
JWT_SECRET
```

同时保留或按实际路径设置：

```text
HOST=0.0.0.0
PORT=1337
DATABASE_FILENAME=.tmp/data.db
```

生产环境如果使用域名，需要额外确认：

```text
PUBLIC_URL
STRAPI_ADMIN_BACKEND_URL
VITE_CMS_URL
```

## 6. 甲方部署顺序

后端：

```bash
cd backend
npm ci
npm run build
npm run start
```

前端：

```bash
cd frontend
npm ci
npm run build
```

部署后检查：

```text
https://your-domain/
https://your-domain/admin
```

如果前后端不同域名或不同端口，必须确认前端构建时的 `VITE_CMS_URL` 指向真实 Strapi 地址。

## 7. 后台语言与内容语言

Strapi 管理后台界面固定使用英文 Admin UI，这是为了避开 Strapi 后台中文翻译包不完整导致的 Content Manager 偶发崩溃风险。

这不影响网站内容语言：

- 英文网站读取 `locale=en`
- 中文网站读取 `locale=zh-Hans`

不要把 `backend/src/admin/app.js` 改成强制中文后台 UI。

## 8. 交付前最终检查

打包前建议再次执行：

```bash
cd frontend
npm run build

cd ../backend
npm run build
```

确认：

- 前端构建无 TypeScript 报错。
- 后端构建出现 `Building admin panel` 并成功完成。
- `backend/.tmp/data.db` 存在。
- `backend/public/uploads/` 存在且不为空。
- `DEPLOYMENT.md` 和本清单随包交付。

## 9. 推荐压缩包命名

建议命名：

```text
xmax-ai-website-delivery-YYYYMMDD.zip
```

例如：

```text
xmax-ai-website-delivery-20260618.zip
```

