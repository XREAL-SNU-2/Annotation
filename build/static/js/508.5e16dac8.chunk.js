(self.webpackChunkannotation=self.webpackChunkannotation||[]).push([[508],{80834:function(n,r,t){"use strict";t.r(r),t.d(r,{getED25519Key:function(){return c}});var a=t(93433),e=t(80889),f=t.n(e),o=t(53085).Buffer,i=f().lowlevel;function c(n){var r;r="string"===typeof n?o.from(n,"hex"):n;var t=new Uint8Array(64),e=[i.gf(),i.gf(),i.gf(),i.gf()],f=new Uint8Array([].concat((0,a.Z)(new Uint8Array(r)),(0,a.Z)(new Uint8Array(32)))),c=new Uint8Array(32);i.crypto_hash(t,f,32),t[0]&=248,t[31]&=127,t[31]|=64,i.scalarbase(e,t),i.pack(c,e);for(var u=0;u<32;u+=1)f[u+32]=c[u];return{sk:o.from(f),pk:o.from(c)}}},78848:function(){}}]);