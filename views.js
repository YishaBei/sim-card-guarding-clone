const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const iconMap = { home: '🏠', position: '📍', message: '💬', mine: '👤', login: '🔐', accounts: '🧑‍🤝‍🧑' };
const routeName = r => ({
  '/home': '首页', '/position': '位置', '/message': '消息', '/mine': '我的', '/login': '登录', '/accounts': '账号管理',
  '/warnRecord': '预警记录', '/addFamily': '添加家人页', '/addMsg': '新建消息', '/familyMemberAuth': '家人授权', '/guardSet': '编辑守护区域',
  '/quickLogin': '快捷登录', '/verifyLogin': '短信验证登录页', '/sdkLogin': '一级掌厅单点登录', '/positionLog': '位置查询记录',
  '/positionHistory': '活动轨迹', '/feedback': '产品意见反馈', '/positionShare': '位置分享', '/electricityAdd': '号码标记'
}[r] || '功能页');

const nav = active => `
  <nav class="nav">
    ${[['/home','🏠','首页'],['/position','📍','位置'],['/message','💬','消息'],['/mine','👤','我的']].map(([p,i,t]) => `
      <a class="${active === p ? 'active' : ''}" href="#${p}"><span class="nav-ico">${i}</span>${t}</a>
    `).join('')}
  </nav>`;

const shell = (content, active = '', sidebar = '') => `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand desktop-brand">
        <div class="brand-badge">守</div>
        <div>守护宝<small>号码守护 · 位置守护 · 防诈提醒</small></div>
      </div>
      <div class="sidebar-panel">${sidebar || `<div class="sidebar-note">桌面模式显示更宽的布局与侧边导航。</div>`}</div>
      <div class="sidebar-links">
        ${[['/home','首页'],['/position','位置'],['/message','消息'],['/mine','我的'],['/accounts','账号管理']].map(([p,t]) => `<a class="${active === p ? 'active' : ''}" href="#${p}">${t}</a>`).join('')}
      </div>
    </aside>
    <main class="main">
      <div class="topbar">
        <div class="topbar-row">
          <div class="brand mobile-brand"><div class="brand-badge">守</div><div>守护宝<small>号码守护 · 位置守护 · 防诈提醒</small></div></div>
          <div class="topbar-actions">
            <button class="icon-btn" onclick="location.hash='#/accounts'">🧑‍🤝‍🧑</button>
            <button class="icon-btn" onclick="location.hash='#/mine'">☰</button>
          </div>
        </div>
      </div>
      <div class="content">${content}</div>
      ${nav(active)}
    </main>
  </div>
`;

const card = (ico, t, d, b = '') => `<div class="card list-item"><div class="left"><div class="avatar">${ico}</div><div><h4>${escapeHtml(t)}</h4><p>${escapeHtml(d)}</p></div></div>${b ? `<span class="badge">${b}</span>` : ''}</div>`;

function accountPanel() {
  return `
    <div class="section-header"><h2>已保存账号</h2><span>${G.s.accounts.length} 个</span></div>
    <div class="card list">
      ${G.s.accounts.map(a => `
        <div class="form-row account-row">
          <div>
            <strong>${escapeHtml(a.label)}</strong>
            <span>${escapeHtml(a.phone)}${a.id === G.s.active ? ' · 当前使用' : ''}${a.note ? ' · ' + escapeHtml(a.note) : ''}</span>
          </div>
          <div class="row-actions">
            <button class="mini-btn ${a.id === G.s.active ? 'primary' : ''}" onclick="G.setActiveAccount('${a.id}'); location.hash='#/mine';">${a.id === G.s.active ? '已选' : '切换'}</button>
            <button class="mini-btn danger" onclick="G.deleteAccount('${a.id}'); location.hash='#/mine';">删除</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function accountForm() {
  return `
    <div class="card stack form-card">
      <input class="input" id="accLabel" placeholder="账号名称，例如 工作号" />
      <input class="input" id="accPhone" placeholder="手机号" />
      <input class="input" id="accToken" placeholder="可选：认证 token / cookie 片段" />
      <input class="input" id="accNote" placeholder="备注" />
      <button class="cta" onclick="(function(){const id='acc-'+Date.now();G.upsertAccount({id,label:document.getElementById('accLabel').value||'未命名账号',phone:document.getElementById('accPhone').value||'13800000000',token:document.getElementById('accToken').value||'',note:document.getElementById('accNote').value||''});location.hash='#/mine';})();">保存并切换</button>
    </div>
  `;
}

window.views = {
  home() {
    return shell(`
      <section class="hero">
        <h1>开启区域守护<br>让家人安全看得见</h1>
        <p>复刻中国移动守护宝的移动端信息架构，并支持桌面浏览、账号切换和真实代理请求。</p>
        <div class="hero-actions">
          <button class="pill-btn primary" onclick="location.hash='#/position'">立即查看守护</button>
          <button class="pill-btn" onclick="location.hash='#/accounts'">管理账号</button>
        </div>
      </section>
      <section class="section">
        <div class="section-header"><h2>核心功能</h2><span>已分析并复刻</span></div>
        <div class="grid cols-2">
          <div class="card service-card" onclick="location.hash='#/position'"><div class="service-ico">📍</div><div><h3>区域守护</h3><p>电子围栏、进出提醒、守护区域编辑与记录。</p></div></div>
          <div class="card service-card" onclick="location.hash='#/accounts'"><div class="service-ico">🧑‍🤝‍🧑</div><div><h3>多账号管理</h3><p>保存多个账号凭据并快速切换当前会话。</p></div></div>
          <div class="card service-card" onclick="location.hash='#/message'"><div class="service-ico">💬</div><div><h3>提醒记录</h3><p>查看风险提醒、福利通知与消息详情。</p></div></div>
          <div class="card service-card" onclick="location.hash='#/mine'"><div class="service-ico">⚙️</div><div><h3>会员中心</h3><p>管理隐私政策、反馈入口和服务状态。</p></div></div>
        </div>
      </section>
      <section class="section">
        <div class="section-header"><h2>当前状态</h2><span>${escapeHtml(G.getActiveAccount()?.label || '未登录')}</span></div>
        <div class="card" style="padding:14px"><div class="stat-row"><div class="card stat"><b>2</b><span>守护区域</span></div><div class="card stat"><b>${G.s.accounts.length}</b><span>账号</span></div><div class="card stat"><b>6</b><span>提醒</span></div><div class="card stat"><b>98%</b><span>覆盖率</span></div></div></div>
      </section>
      <section class="section">
        <div class="section-header"><h2>服务入口</h2><span>模拟官网路由</span></div>
        <div class="list">
          ${card(iconMap.login, '一键登录 / 短信登录', '与原站一致的登录流程入口与验证码交互。', `<span class="badge">进入</span>`)}
          ${card('📝', '产品意见反馈', '提供反馈内容并模拟提交接口。', `<span class="badge">反馈</span>`)}
        </div>
      </section>
      <div class="footer-space"></div>
    `, '/home', accountPanel());
  },
  position() {
    return shell(`
      <div class="page-title"><button class="back" onclick="history.back()">←</button><div><h1>守护页</h1><p>编辑守护区域、进出区域守护和位置查询记录</p></div></div>
      <div class="map card"><div class="map-pin">📍</div></div>
      <section class="section"><div class="section-header"><h2>守护区域</h2><span>电子围栏</span></div><div class="card list">${G.s.r.map(g => `<div class="form-row"><div><strong>${escapeHtml(g.n)}</strong><span>${escapeHtml(g.d)}</span></div><div class="toggle ${g.on ? 'on' : ''}"></div></div>`).join('')}</div></section>
      <section class="section"><div class="grid cols-2"><button class="cta secondary" onclick="location.hash='#/guardSet'">编辑守护区域</button><button class="cta" onclick="location.hash='#/positionLog'">位置查询记录</button></div></section>
      <section class="section"><div class="section-header"><h2>相关能力</h2><span>bundle 路由</span></div><div class="tag-row"><a class="tag" href="#/positionHistory">活动轨迹</a><a class="tag" href="#/positionShare">位置分享</a><a class="tag" href="#/familyMemberAuth">家人授权</a><a class="tag" href="#/warnRecord">预警记录</a></div></section>
      <div class="footer-space"></div>
    `, '/position');
  },
  message() {
    return shell(`
      <div class="page-title"><button class="back" onclick="history.back()">←</button><div><h1>消息中心</h1><p>新建消息、提醒记录与模板管理</p></div></div>
      <section class="section"><div class="section-header"><h2>提醒记录</h2><span>messageSelect</span></div><div class="list">${G.s.m.map(x => card(x.b === '福利' ? '🎁' : x.b === '提醒' ? '⚠️' : '💬', x.t, x.d, `<span class="badge">${x.time}</span>`)).join('')}</div></section>
      <section class="section"><div class="grid cols-2"><button class="cta secondary" onclick="location.hash='#/addMsg'">新建消息</button><button class="cta secondary" onclick="location.hash='#/feedback'">产品意见反馈</button></div></section>
      <div class="footer-space"></div>
    `, '/message');
  },
  mine() {
    const a = G.getActiveAccount();
    return shell(`
      <div class="page-title"><button class="back" onclick="history.back()">←</button><div><h1>我的</h1><p>会员中心、政策入口与服务设置</p></div></div>
      <section class="hero compact"><h1>${escapeHtml(G.s.u?.name || a?.label || '用户')}</h1><p>${escapeHtml(G.s.u?.phone || a?.phone || '138****0000')} · ${escapeHtml(G.s.u?.level || '会员')} · ${escapeHtml(G.s.u?.region || '中国移动')}</p><div class="hero-actions"><button class="pill-btn primary" onclick="location.hash='#/login'">切换/登录</button><button class="pill-btn" onclick="location.hash='#/privacyPolicy'">隐私政策</button></div></section>
      <section class="section"><div class="section-header"><h2>常用入口</h2><span>官网原生风格</span></div><div class="card list">${[['/guardianPolicy','用户协议'],['/privacyPolicyZy','隐私政策摘要'],['/collectPolicy','个人信息使用与收集清单'],['/childrenPolicy','儿童隐私保护声明'],['/feedback','产品意见反馈'],['/xiheFamily','羲和防诈家庭版说明']].map(([p, t]) => `<div class="form-row" onclick="location.hash='#${p}'" style="cursor:pointer"><div><strong>${escapeHtml(t)}</strong><span>打开详情页面</span></div><span>›</span></div>`).join('')}</div></section>
      <section class="section"><div class="section-header"><h2>账号管理</h2><span>多账号</span></div>${accountPanel()}<div style="height:12px"></div>${accountForm()}</section>
      <div class="footer-space"></div>
    `, '/mine', `<div class="sidebar-note"><strong>当前账号</strong><br>${escapeHtml(a?.label || '')}<br>${escapeHtml(a?.phone || '')}</div>`);
  },
  login() {
    return shell(`
      <div class="page-title"><button class="back" onclick="history.back()">←</button><div><h1>登录</h1><p>短信登录 / 一键登录 / 快捷登录</p></div></div>
      <section class="stack">
        <div class="card" style="padding:14px"><div class="tag-row" style="margin-bottom:12px"><span class="tag">一键登录</span><span class="tag">短信登录</span><span class="tag">SDK 登录</span></div><input class="input" id="loginLabel" placeholder="账号名称，例如 主号" /><div style="height:8px"></div><input class="input" id="loginPhone" placeholder="手机号" value="13800000000" /><div style="height:8px"></div><input class="input" id="loginToken" placeholder="可选 token / cookie" /></div>
        <div class="card" style="padding:14px"><input class="input" placeholder="请输入短信验证码" /><div style="height:10px"></div><button class="cta" onclick="(function(){const id='acc-'+Date.now();G.upsertAccount({id,label:document.getElementById('loginLabel').value||'登录账号',phone:document.getElementById('loginPhone').value||'13800000000',token:document.getElementById('loginToken').value||'',note:'由登录页保存'});location.hash='#/mine';})();">保存账号并进入</button><div style="height:10px"></div><button class="cta secondary" onclick="location.hash='#/home'">先浏览首页</button></div>
        <div class="notice">登录页保留短信验证码、快捷登录和一键登录入口；会把多个账号保存在本地并允许切换。</div>
      </section>
    `, '/login');
  },
  accounts() {
    return shell(`
      <div class="page-title"><button class="back" onclick="history.back()">←</button><div><h1>账号管理</h1><p>保存、切换与删除多个账号</p></div></div>
      <section class="section">${accountPanel()}</section>
      <section class="section">${accountForm()}</section>
    `, '/accounts', accountPanel());
  },
  policy(r) {
    return shell(`
      <div class="page-title"><button class="back" onclick="history.back()">←</button><div><h1>${escapeHtml(G.s.p[r] || '政策详情')}</h1><p>policy / agreement / privacy</p></div></div>
      <div class="card policy"><p>${escapeHtml({
        '/locationPolicy': '本页用于说明位置服务、电子围栏、进出提醒及地图能力的使用场景。',
        '/collectPolicy': '本页用于说明个人信息收集、使用、共享与委托处理的范围。',
        '/guardianPolicy': '本页用于展示守护宝服务协议、使用规则与功能说明。',
        '/privacyPolicy': '本页用于展示完整隐私政策与相关权限说明。',
        '/privacyPolicyZy': '本页用于展示隐私政策摘要。',
        '/childrenPolicy': '本页用于展示儿童隐私保护声明。',
        '/xiheFamily': '本页用于展示羲和防诈家庭版的功能说明。'
      }[r] || '内容加载中。')}</p><p>真实站点中这些页面通常与 <code>/sim/silver/hair/api/agreement/query</code>、<code>/sim/silver/hair/api/agreement/add</code> 联动。</p></div>
    `, '/mine');
  },
  generic(r) {
    const t = routeName(r);
    return shell(`
      <div class="page-title"><button class="back" onclick="history.back()">←</button><div><h1>${escapeHtml(t)}</h1><p>${escapeHtml(r)}</p></div></div>
      <div class="card policy"><p>这是原站对应功能页的交互占位复刻，适合演示导航、布局和 API 调用路径。</p><p>真实站点中会围绕 <code>${escapeHtml(r)}</code> 与相关后端接口进行表单、授权、查询或提交操作。</p><div class="grid cols-2" style="margin-top:14px"><button class="cta secondary" onclick="location.hash='#/home'">返回首页</button><button class="cta" onclick="location.hash='#/position'">去守护页</button></div></div>
    `, r);
  }
};
