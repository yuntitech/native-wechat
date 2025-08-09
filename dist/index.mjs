import { TurboModuleRegistry as b, NativeModules as y, NativeEventEmitter as w, DeviceEventEmitter as E } from "react-native";
import { useState as M, useEffect as P } from "react";
function R(e, t, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(f) {
      f(i);
    });
  }
  return new (n || (n = Promise))(function(i, f) {
    function g(u) {
      try {
        p(r.next(u));
      } catch (m) {
        f(m);
      }
    }
    function W(u) {
      try {
        p(r.throw(u));
      } catch (m) {
        f(m);
      }
    }
    function p(u) {
      u.done ? i(u.value) : s(u.value).then(g, W);
    }
    p((r = r.apply(e, t || [])).next());
  });
}
class S {
  constructor() {
    Object.defineProperty(this, "handlers", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.handlers = /* @__PURE__ */ new Map();
  }
  getQueue(t) {
    const n = this.handlers.get(t);
    return n || (this.handlers.set(t, []), []);
  }
  listen(t, n) {
    const r = this.getQueue(t);
    this.handlers.set(t, r.concat(n));
  }
  once(t, n) {
    this.handlers.set(t, [n]);
  }
  clear(t) {
    this.handlers.set(t, []);
  }
  dispatch(t, ...n) {
    this.getQueue(t).forEach((s) => s(...n)), this.clear(t);
  }
}
const a = (e) => (...t) => new Promise((n, r) => {
  e(...t, (s, i) => {
    s ? r(i) : n(i);
  });
}), N = "cn.bookln.nativeWechat.NativeWechat_Req", { Wechat: q } = y, o = b.get("Wechat") || q, _ = () => {
  const [e, t] = M(!1);
  return P(() => {
    k().then(() => t(!0)).catch(() => t(!1));
  }, []), e;
}, d = new S();
let v = !1, h = null, l = null;
const I = (e) => new Error(`[Native Wechat]: (${e.errorCode}) ${e.errorStr}`), c = (e) => {
  if (!v)
    throw new Error(`Please register SDK before invoking ${e}`);
}, x = () => a(o.checkUniversalLinkReady)(), A = (e) => {
  v || (o.registerApp(e), v = !0), h && (h.remove(), h = null), l && (l.remove(), l = null);
  const t = new w(o);
  return h = t.addListener("NativeWechat_Response", (n) => {
    const r = n.errorCode ? I(n) : null;
    d.dispatch(n.type, r, n);
  }), l = t.addListener("NativeWechat_Req", (n) => {
    E.emit(N, { response: n });
  }), () => {
    h && (h.remove(), h = null), l && (l.remove(), l = null);
  };
}, k = () => a(o.isWechatInstalled)(), T = (e = {
  scope: "snsapi_userinfo",
  state: ""
}) => {
  c("sendAuthRequest");
  const t = a(o.sendAuthRequest);
  return new Promise((n, r) => {
    t(e).catch(r), d.once("SendAuthResp", (s, i) => s ? r(s) : n(i));
  });
}, Q = (e) => (c("shareText"), a(o.shareText)(e)), V = (e) => (c("shareImage"), a(o.shareImage)(e)), $ = (e) => (c("shareVideo"), a(o.shareVideo)(e)), D = (e) => (c("shareWebpage"), a(o.shareWebpage)(e)), U = (e) => (c("shareMiniProgram"), a(o.shareMiniProgram)(e)), B = (e) => {
  c("requestPayment");
  const t = a(o.requestPayment);
  return new Promise((n, r) => R(void 0, void 0, void 0, function* () {
    t(e).catch(r), d.once("PayResp", (s, i) => s ? r(s) : n(i));
  }));
}, F = (e) => {
  c("requestSubscribeMessage");
  const t = a(o.requestSubscribeMessage);
  return e.scene = +e.scene, t(e);
}, H = (e) => (c("openCustomerService"), a(o.openCustomerService)(e)), K = (e) => {
  c("launchMiniProgram"), e.miniprogramType = +e.miniprogramType;
  const t = a(o.launchMiniProgram);
  return d.once("WXLaunchMiniProgramResp", (n, r) => {
    var s;
    if (!n)
      return (s = e.onNavBack) === null || s === void 0 ? void 0 : s.call(e, r);
  }), t(e);
}, O = o.getConstants();
export {
  O as NativeWechatConstants,
  x as checkUniversalLinkReady,
  k as isWechatInstalled,
  K as launchMiniProgram,
  H as openCustomerService,
  A as registerApp,
  B as requestPayment,
  F as requestSubscribeMessage,
  T as sendAuthRequest,
  V as shareImage,
  U as shareMiniProgram,
  Q as shareText,
  $ as shareVideo,
  D as shareWebpage,
  _ as useWechatInstalled
};
