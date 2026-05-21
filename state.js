window.G = {
  s: {
    u: null,
    c: null,
    g: null,
    m: [
      { t: '已成功添加被守护人', d: '您已成功添加被守护人，点击查看守护详情。', b: '通知', time: '今天 09:18' },
      { t: '请及时完成实名认证', d: '为使用守护区域与位置查询，请先完成实名认证。', b: '提醒', time: '昨天' },
      { t: '恭喜您获得流量福利', d: '现在可点击领取，数量有限，领完即止。', b: '福利', time: '周三' }
    ],
    r: [
      { n: '家', d: '广东省深圳市南山区 科技园附近', on: true },
      { n: '学校', d: '广东省深圳市南山区 学校周边', on: false }
    ],
    p: {
      '/locationPolicy': '智能提醒及位置隐私政策',
      '/collectPolicy': '个人信息使用与收集清单',
      '/guardianPolicy': '用户协议与守护宝说明',
      '/privacyPolicy': '隐私政策',
      '/privacyPolicyZy': '隐私政策摘要',
      '/childrenPolicy': '守护宝儿童隐私保护声明',
      '/xiheFamily': '羲和防诈家庭版说明'
    },
    accounts: []
  }
};

const KEY = 'sim-card-guarding-clone.accounts';
const ACTIVE = 'sim-card-guarding-clone.active';

function loadJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

G.s.accounts = loadJSON(KEY, [
  { id: 'default', label: '默认账号', phone: '13800000000', token: '', note: '本地保存的演示账号' }
]);
G.s.active = localStorage.getItem(ACTIVE) || 'default';

G.persistAccounts = () => saveJSON(KEY, G.s.accounts);
G.persistActive = () => localStorage.setItem(ACTIVE, G.s.active);
G.getActiveAccount = () => G.s.accounts.find(a => a.id === G.s.active) || G.s.accounts[0] || null;
G.setActiveAccount = id => {
  G.s.active = id;
  G.persistActive();
};
G.upsertAccount = acc => {
  const next = G.s.accounts.filter(a => a.id !== acc.id).concat(acc);
  G.s.accounts = next;
  G.s.active = acc.id;
  G.persistAccounts();
  G.persistActive();
};
G.deleteAccount = id => {
  G.s.accounts = G.s.accounts.filter(a => a.id !== id);
  if (!G.s.accounts.length) {
    G.s.accounts = [{ id: 'default', label: '默认账号', phone: '13800000000', token: '', note: '本地保存的演示账号' }];
  }
  if (!G.s.accounts.some(a => a.id === G.s.active)) G.s.active = G.s.accounts[0].id;
  G.persistAccounts();
  G.persistActive();
};
G.currentHeaders = () => {
  const a = G.getActiveAccount();
  return a?.token
    ? { Authorization: a.token, 'X-Account-Label': a.label, 'X-Account-Phone': a.phone }
    : { 'X-Account-Label': a?.label || 'anonymous' };
};
G.api = async (path, options = {}) => {
  const res = await fetch(path, {
    ...options,
    headers: { 'content-type': 'application/json', ...G.currentHeaders(), ...(options.headers || {}) }
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text, status: res.status };
  }
};
