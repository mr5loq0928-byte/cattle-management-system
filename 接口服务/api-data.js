// ============================================================
//  牛只管理系统 · 练习用接口服务  —— 数据文件
//  作用：存放初始数据，服务启动时读进来；重启服务 = 数据恢复原样
//  注意：不要改这个文件，改了练习题就不准了
// ============================================================

// 用户表（登录用）
const USERS = [
  { id: 1, username: 'admin',  password: '123456', role: '管理员', phone: 'DEMO_PHONE_001' },
  { id: 2, username: 'tester', password: '123456', role: '测试员', phone: 'DEMO_PHONE_002' }
];

// 牛只档案表（和 SQL 练习里那 10 头牛一样）
const COWS = [
  { id: 1,  ear_tag: 'A0001', breed: '西门塔尔', gender: '母', in_date: '2024-03-12', weight: 520.50, state: '正常' },
  { id: 2,  ear_tag: 'A0002', breed: '荷斯坦',   gender: '母', in_date: '2024-05-08', weight: 480.00, state: '正常' },
  { id: 3,  ear_tag: 'A0003', breed: '西门塔尔', gender: '公', in_date: '2023-11-20', weight: 610.80, state: '出栏' },
  { id: 4,  ear_tag: 'A0004', breed: '夏洛莱',   gender: '公', in_date: '2024-01-15', weight: 640.20, state: '正常' },
  { id: 5,  ear_tag: 'A0005', breed: '荷斯坦',   gender: '母', in_date: '2024-07-01', weight: 450.30, state: '正常' },
  { id: 6,  ear_tag: 'A0006', breed: '鲁西黄牛', gender: '公', in_date: '2023-09-05', weight: 580.00, state: '淘汰' },
  { id: 7,  ear_tag: 'A0007', breed: '西门塔尔', gender: '母', in_date: '2024-09-18', weight: 510.75, state: '正常' },
  { id: 8,  ear_tag: 'A0008', breed: '夏洛莱',   gender: '母', in_date: '2024-02-28', weight: 495.60, state: '出栏' },
  { id: 9,  ear_tag: 'A0009', breed: '荷斯坦',   gender: '母', in_date: '2023-12-10', weight: 470.90, state: '正常' },
  { id: 10, ear_tag: 'A0010', breed: '鲁西黄牛', gender: '母', in_date: '2024-06-22', weight: 430.25, state: '正常' }
];

// 每次启动服务，都从这里克隆一份新的，保证数据干净
function freshUsers() { return JSON.parse(JSON.stringify(USERS)); }
function freshCows()  { return JSON.parse(JSON.stringify(COWS)); }

module.exports = { freshUsers, freshCows };