# 萤火盛夏网站

纯静态网站，仓库根目录就是发布目录，可直接部署到 GitHub Pages。页面现有地址保持不变。

## 目录

```text
index.html                  首页
feedback/                   反馈页面
hidamari-channel/           向阳频道页面、阅读器和书籍正文
minecraft/                  Minecraft 页面
works/                      资源中心、颜色工具和关于页面
assets/
  css/                      样式，按页面或功能分组
  js/                       浏览器脚本，按功能分组
  images/                   图片和图标，按用途分组
  data/                     论坛列表、色板等 JSON 数据
  vendor/halfmoon/           第三方库及其许可证
src/                        TypeScript 源码，与 assets/js 的子目录对应
tools/                      本地维护和检查工具
tsconfig.json               TypeScript 编译配置
CNAME                       自定义域名配置
```

## 本地预览

在仓库根目录启动服务，再访问对应页面：

```sh
python -m http.server 8000
```

通过 HTTP 访问，例如 `http://localhost:8000/`。直接打开本地 HTML 文件可能导致 JSON、Markdown 加载失败。

## 修改约定

- 页面 HTML 留在所属栏目；新增样式、脚本、图片和 JSON 分别放入 `assets` 下对应目录，使用小写连字符命名。
- 跨页面共享资源放入各类型目录下的 `shared/`；功能专用资源放入 `minecraft/`、`works/`、`reader/` 等子目录。
- 本地资源使用 `/assets/...` 站点根路径。`fetch` 的相对路径按页面地址解析，不按脚本文件地址解析，因此数据请求也使用站点根路径。
- 阅读器的 Markdown 正文和书籍页面放在同一书籍目录，方便一起维护。
- `src/minecraft/forums.ts` 和 `src/shared/succubus.ts` 是对应浏览器脚本的源码。修改后，在已安装 TypeScript 编译器的环境运行 `tsc -p tsconfig.json`，同时提交生成的 `assets/js` 文件。普通 HTML、CSS、JavaScript 修改不需要构建。
- 第三方库集中放在 `assets/vendor/`，保留其许可证和内部相对路径。
- 本次只整理文件位置和引用；页面内联样式、内联脚本及现有功能保持原有实现。

## 检查

```sh
python tools/check_site.py
```

检查本地页面导航、样式、图片、脚本及 JSON 数据引用，包含动态脚本中使用的站点根路径。路径按大小写严格校验，与 GitHub Pages 一致。检查不访问外部 CDN 或第三方网站。

清理 Git 历史后，不要从尚未完成同样清理的旧克隆或 fork 合并历史，以免重新引入已删除的资源。
