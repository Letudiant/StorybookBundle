'use strict';

var httpProxyMiddleware = require('http-proxy-middleware');
var e = require('@storybook/builder-webpack5');

function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
                Object.keys(e).forEach(function (k) {
                        if (k !== 'default') {
                                var d = Object.getOwnPropertyDescriptor(e, k);
                                Object.defineProperty(n, k, d.get ? d : {
                                        enumerable: true,
                                        get: function () { return e[k]; }
                                });
                        }
                });
        }
        n.default = e;
        return Object.freeze(n);
}

var e__namespace = /*#__PURE__*/_interopNamespace(e);

function h(n){for(var u=[],t=1;t<arguments.length;t++)u[t-1]=arguments[t];var r=Array.from(typeof n=="string"?[n]:n);r[r.length-1]=r[r.length-1].replace(/\r?\n([\t ]*)$/,"");var s=r.reduce(function(o,d){var p=d.match(/\n([\t ]+|(?!\s).)/g);return p?o.concat(p.map(function(f){var a,i;return (i=(a=f.match(/[\t ]/g))===null||a===void 0?void 0:a.length)!==null&&i!==void 0?i:0})):o},[]);if(s.length){var l=new RegExp(`
[	 ]{`+Math.min.apply(Math,s)+"}","g");r=r.map(function(o){return o.replace(l,`
`)});}r[0]=r[0].replace(/^\r?\n/,"");var c=r[0];return u.forEach(function(o,d){var p=c.match(/(?:^|\n)( *)$/),f=p?p[1]:"",a=o;typeof o=="string"&&o.includes(`
`)&&(a=String(o).split(`
`).map(function(i,y){return y===0?i:""+f+i}).join(`
`)),c+=a+r[d+1];}),c}var g=h;var P=e__namespace.getConfig,B=e__namespace.bail,w=async n=>{let u=n.options.configType==="PRODUCTION",{symfony:t}=await n.options.presets.apply("frameworkOptions");if(!t.server)throw new Error(g`
        Cannot configure dev server.
        
        "server" option in "framework.options.symfony" is required for Storybook dev server to run.
        Update your main.ts|js file accordingly.
        `);let r=["/_storybook/render","/_storybook/preview"];if(t.proxyPaths){let s=Array.isArray(t.proxyPaths)?t.proxyPaths:[t.proxyPaths];r.push(...s);}for(let s of r)n.router.use(s,httpProxyMiddleware.createProxyMiddleware({target:t.server,changeOrigin:!0,secure:u,logLevel:"debug",headers:{"X-Storybook-Proxy":"true"}}));return e__namespace.start(n)},k=e__namespace.build,O=e__namespace.corePresets,C=e__namespace.overridePresets;

exports.bail = B;
exports.build = k;
exports.corePresets = O;
exports.getConfig = P;
exports.overridePresets = C;
exports.start = w;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=webpack-builder.js.map