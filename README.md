# 牛只管理系统 · 软件测试练习 Demo

用于功能测试、接口测试及自动化测试学习的中文开源练习项目。提供登录、牛只列表、详情、新增和删除接口，以及接口文档、练习题、参考缺陷清单和 Postman 集合。

**这是用于发现缺陷的本地练习服务。代码保留了故意设计的缺陷，接口文档描述的是期望行为，实际响应可能违反它；不要为了让测试通过而降低预期。它不是实际养殖业务系统。** 默认只监听 127.0.0.1。**仅供本地学习使用，不适合部署到公网或生产环境。**

## 技术栈与数据

- 后端：Node.js + JavaScript，仅使用内置 http 模块，无 Express、无需 npm 安装运行依赖。
- 页面：HTML + 内联 CSS 教学材料；没有独立管理前端、前后端页面交互或可视化增删改界面。
- 数据库：不需要 MySQL、MongoDB 或 Docker。两名演示用户、10 条牛只数据由 `接口服务/api-data.js` 初始化到内存。
- 服务重启后全部数据恢复初始状态。POST /api/_reset 只重置牛只数据和编号，不重置用户状态。
- 测试：提供 Postman 集合；requests 和 pytest 可自行安装作为练习工具，项目未附完整 Python 自动化框架。

## 目录结构

```text
cattle-management-system/
├── README.md
├── .gitignore
├── package.json
├── 接口服务/
│   ├── api-server.js         # 路由和服务
│   └── api-data.js           # 演示用户和牛只初始数据
├── 接口文档.html             # 输入字段、期望响应和业务规则
├── 练习题.html
├── 参考答案_缺陷清单.html     # 建议完成练习后再看
├── Postman操作步骤.html
├── 接口测试练习.postman_collection.json
├── 接口测试练习_带断言.postman_collection.json
├── 启动接口服务.bat          # 原 Windows 启动辅助脚本
└── 跑接口测试并生成报告.bat  # 可选，需要自行安装 Newman 和报告插件
```

## Windows 本地启动

安装 Node.js LTS（建议使用 Node.js 24 LTS；本次已在 Node.js v24.21.0 验证）。安装 Git 后克隆仓库：

```powershell
git clone https://github.com/mr5loq0928-byte/cattle-management-system.git
Set-Location cattle-management-system
node --version
npm start
```

下载 ZIP 的用户解压后在实际文件夹内打开终端即可。

也可以直接执行：

```powershell
node .\接口服务\api-server.js
```

看到启动提示后，浏览器访问 http://127.0.0.1:8124/ 确认服务运行。此首页只是服务状态页面，不是业务管理界面。终端不要关闭；按 Ctrl+C 停止本次服务。

在另一个终端执行冒烟检查：

```powershell
Invoke-RestMethod http://127.0.0.1:8124/api/cows
```

双击接口文档、练习题等 HTML 文件，在浏览器阅读。已有 Node 且默认端口空闲时，也可以双击启动接口服务.bat。推荐初学者先使用终端启动，方便读取错误信息。

## 演示账号

| 用户名 | 密码 | 演示角色 |
|---|---|---|
| admin | 123456 | 管理员 |
| tester | 123456 | 测试员 |

这些只是公开本地演示数据，不能用于任何真实服务。手机号字段采用 DEMO_PHONE_001、DEMO_PHONE_002 占位字符串，不代表真实号码。登录返回包含 password 等行为是待发现的练习缺陷。

## 接口与功能

| 方法 | 路径 | 功能 |
|---|---|---|
| GET | / | 服务状态 |
| POST | /api/login | 登录并返回演示 Token |
| GET | /api/cows | 列表、分页、品种和状态筛选 |
| GET | /api/cows/{id} | 牛只详情 |
| POST | /api/cows | 新增牛只 |
| DELETE | /api/cows/{id} | 删除牛只 |
| POST | /api/_reset | 重置牛只练习数据 |

当前没有 PUT 更新接口，虽然 CORS 方法声明包含 PUT，也不代表已经实现更新。请求字段请先查阅接口文档.html，例如新增需要 ear_tag、breed、gender、in_date、weight 等；不能凭接口名字猜测请求体。

业务标准和实际实现应分开观察：登录密码校验、响应泄漏密码、分页、筛选总数、字段校验及删除鉴权均可作为找缺陷的练习方向。接口预期以中文文档说明为准，参考答案仅供复核。

## 如何开展测试

### 功能与业务规则练习

通过接口操作牛只档案，覆盖等价类、边界值、重复耳标、缺失字段、非法体重、日期格式、品种筛选、翻页与未登录操作。这个版本没有独立业务网页，不提供真实页面点击测试。

### Postman

启动服务后导入任一 postman_collection.json。基础集合适合自己补断言；带断言集合用于对照学习，其中部分断言应因预设缺陷失败。Token 使用集合变量 token，登录后查看变量；不要把自己的生产环境 Token 导入本项目。

### requests + pytest（可选练习环境）

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install requests pytest
```

用 PyCharm 选择 .venv 中的 Python，自建 learning 或 tests 目录编写练习。先写 GET /api/cows 状态码和 JSON 断言，再逐步学习登录 JSON 请求体、提取 Token、牛只创建与查询关联、参数化和 fixture。

常用方式：requests.get 用 params 传筛选字典，requests.post 用 json 传请求体；响应的 .json() 用于解析正文。请求设置 timeout，assert 检查真实预期，print 只帮助观察。

```powershell
.\.venv\Scripts\python.exe -m pytest learning -v -s
```

这条命令适用于你已经创建自己的 learning 测试文件之后；仓库没有预先完成的 Python 测试套件，未创建文件时提示目录不存在是正常的。

### Newman（可选）

```powershell
npm install -g newman newman-reporter-htmlextra
newman run .\接口测试练习_带断言.postman_collection.json
```

生成报告可以使用附带的批处理脚本。报告和运行日志已被 .gitignore 排除。集合执行可能增删或重置当前服务数据；练习前先确认它指向自己的本机服务。包含预期缺陷断言时，失败不一定是环境安装错误。

## 常见问题

| 问题 | 检查方式 |
|---|---|
| 找不到 node/npm | 安装 Node.js 后重新打开终端，检查 node --version |
| 8124 端口占用 | 先确认是不是自己已启动的服务，不随意结束未知进程；可用 node .\接口服务\api-server.js 18124 启动另一端口，并同步修改请求地址 |
| 打开 HTML 没有自动启动接口 | 教学文档和后端是两件事，需要另开终端启动 Node |
| 重启后数据消失 | 当前是内存存储，重启重新载入初始数据 |
| 部分断言失败 | 看实际响应并对照文档，可能发现了预设缺陷，不要直接修改断言 |
| 新增返回 500 | 先检查请求字段、类型和 JSON，保留返回内容；缺失字段处理本身也可能是待发现缺陷 |
| 乱码 | HTML/JS/JSON 为 UTF-8；原批处理脚本采用 Windows 中文代码页，可改用终端启动 |
| 不同端口首页仍写 8124 | 首页提示是固定文字；实际监听端口以启动终端为准，端口参数不自动更新文档/集合 |

## 修改与贡献

初学者可以提交复现步骤、测试用例和缺陷分析。修复预设缺陷前请先讨论教学目标，避免让练习答案和规则失去对应关系。不要提交 .venv、node_modules、编辑器配置、个人测试报告或真实账号信息。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。项目所有者已确认公开材料由其制作或有权分发。
