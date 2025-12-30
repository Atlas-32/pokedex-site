pokedex-site

这是一个使用 Next.js 构建的纯静态站点（SSG）。

安装依赖：

```bash
npm install
```

开发模式：

```bash
npm run dev
```

生成静态站点并导出到 `out/`：

```bash
npm run export:static
```

在 `out/` 目录预览（使用 npx serve 或 python 简单 HTTP 服务器）：

```bash
npx serve out
# or
python3 -m http.server --directory out 3000
```
