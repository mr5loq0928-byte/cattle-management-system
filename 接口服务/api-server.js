// ============================================================
//  牛只管理系统 · 练习用接口服务
//  启动：双击上级目录的「启动接口服务.bat」
//  地址：http://127.0.0.1:8124
//  说明：数据存在内存里，重启服务就恢复原样
// ============================================================
const http = require('http');
const { freshUsers, freshCows } = require('./api-data');

const PORT = Number(process.argv[2] || 8124);

let users  = freshUsers();
let cows   = freshCows();
let nextId = cows.length + 1;

// ---------------- 小工具 ----------------
function send(res, status, obj) {
  const body = Buffer.from(JSON.stringify(obj, null, 2), 'utf8');
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { resolve({ __bad_body: true }); }
    });
  });
}

function pickToken(req) {
  const h = req.headers['authorization'] || req.headers['token'] || '';
  return String(h).replace(/^Bearer\s+/i, '').trim();
}

// ---------------- 路由 ----------------
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1');
  const path = u.pathname;
  const q = u.searchParams;
  const method = req.method.toUpperCase();

  if (method === 'OPTIONS') return send(res, 204, {});

  try {
    // ----- 首页：确认服务活着 -----
    if (path === '/' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>接口服务正在运行</h1><p>地址：http://127.0.0.1:8124</p><p>接口清单见练习文件夹里的《接口文档.html》</p>');
    }

    // ----- 1. 登录 -----
    if (path === '/api/login' && method === 'POST') {
      const body = await readBody(req);
      const user = users.find((x) => x.username === body.username);
      if (!user) return send(res, 200, { code: 1001, msg: '用户名或密码错误', data: null });
      return send(res, 200, {
        code: 0,
        msg: '登录成功',
        data: {
          token: 'tk_' + user.username + '_' + Date.now(),
          userId: user.id,
          username: user.username,
          password: user.password,
          role: user.role
        }
      });
    }

    // ----- 2. 牛只列表（分页 + 筛选）-----
    if (path === '/api/cows' && method === 'GET') {
      const page = Number(q.get('page') || 1);
      const size = Number(q.get('size') || 5);
      const breed = q.get('breed') || '';
      const state = q.get('state') || '';

      let list = cows.slice();
      if (breed) list = list.filter((c) => c.breed === breed);
      if (state) list = list.filter((c) => c.state === state);

      const total = cows.length;
      const start = 0;
      const pageList = list.slice(start, start + size);

      return send(res, 200, {
        code: 0,
        msg: 'ok',
        data: { page: page, size: size, total: total, list: pageList }
      });
    }
    // ----- 3. 牛只详情 -----
    const m = path.match(/^\/api\/cows\/(\d+)$/);
    if (m && method === 'GET') {
      const cow = cows.find((c) => c.id === Number(m[1]));
      if (!cow) return send(res, 404, { code: 1004, msg: '牛只不存在', data: null });
      return send(res, 200, { code: 0, msg: 'ok', data: cow });
    }

    // ----- 4. 新增牛只 -----
    if (path === '/api/cows' && method === 'POST') {
      if (!pickToken(req)) return send(res, 401, { code: 2001, msg: '未登录或 token 无效', data: null });
      const body = await readBody(req);
      if (body.__bad_body) return send(res, 400, { code: 1002, msg: '请求体不是合法的 JSON', data: null });
      const cow = {
        id: nextId++,
        ear_tag: body.ear_tag.trim().toUpperCase(),
        breed: body.breed.trim(),
        gender: body.gender.trim(),
        in_date: body.in_date.trim(),
        weight: Number(body.weight.toString()),
        state: (body.state || '正常').trim()
      };
      cows.push(cow);
      return send(res, 201, { code: 0, msg: '新增成功', data: cow });
    }

    // ----- 5. 删除牛只 -----
    if (m && method === 'DELETE') {
      const idx = cows.findIndex((c) => c.id === Number(m[1]));
      if (idx < 0) return send(res, 404, { code: 1004, msg: '牛只不存在', data: null });
      const gone = cows.splice(idx, 1)[0];
      return send(res, 200, { code: 0, msg: '删除成功', data: gone });
    }

    // ----- 6. 练习辅助接口：把数据恢复成初始的样子 -----
    if (path === '/api/_reset' && method === 'POST') {
      cows = freshCows();
      nextId = cows.length + 1;
      return send(res, 200, { code: 0, msg: '数据已恢复', data: { count: cows.length } });
    }

    // ----- 以上都没匹配上 -----
    return send(res, 404, { code: 1404, msg: '接口不存在: ' + method + ' ' + path, data: null });

  } catch (e) {
    return send(res, 500, { code: 5000, msg: '服务器内部错误', data: { error: String((e && e.message) || e) } });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('接口服务已启动: http://127.0.0.1:' + PORT);
  console.log('牛只数据 ' + cows.length + ' 条，用户 ' + users.length + ' 个');
  console.log('关闭这个窗口 = 停止服务');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.log('端口 ' + PORT + ' 已被占用，服务可能已经在运行。');
  else console.log('启动失败: ' + e.message);
});