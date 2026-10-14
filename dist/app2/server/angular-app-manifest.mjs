
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  baseHref: '/app2/',
  criticalCssPlans: [[1,"/styles-WXP63RRA.css",97,[],[],[[37,"body","{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f5f5f5}",[0],["system-ui","-apple-system","segoe ui","roboto","sans-serif"]]]]],
  locale: undefined,
  routes: [
  {
    "renderMode": 1,
    "route": "/app2"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 860, hash: 'b7da0e121bba64b0', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 975, hash: 'd3ca548748af5746', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
