(async()=>{
  const route = () => ((location.hash.replace(/^#/, '') || '/home').split('?')[0]);
  const [config, user, guide] = await Promise.all([
    G.api('/sim/silver/hair/api/init/config'),
    G.api('/sim/silver/hair/api/silver_hair_auth/silverUserserInfo'),
    G.api('/sim/silver/hair/api/silverHair/guide/getGuideStatus')
  ]);
  G.s.c = config;
  G.s.u = user?.data || { name: '聖園彌香', phone: '138****0000', level: '黄金会员', region: '广东·深圳' };
  G.s.g = guide?.data || { finished: true };
  const render = () => {
    const r = route();
    const page = views[r.slice(1)] ? views[r.slice(1)]() : (views.policy(r) || views.generic(r));
    document.getElementById('app').innerHTML = page;
  };
  window.addEventListener('hashchange', render);
  window.addEventListener('storage', () => render());
  render();
})();
