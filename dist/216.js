(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[216],{6471:(t,e,n)=>{"use strict";n.d(e,{Z:()=>k});var a=n(7294),r=n(5366),o=n(8276);const i=(0,r.Z)("div",{target:"e11jvj895"})({name:"ra6cyy",styles:"display:flex;width:100%;padding:20px;padding-top:0"}),s=(0,r.Z)("form",{target:"e11jvj894"})({name:"33ihw2",styles:"color:rgb(29, 28, 29);font-size:15px;width:100%;border-radius:4px;border:1px solid rgb(29, 28, 29)"}),l=(0,r.Z)(o.r,{target:"e11jvj893"})({name:"1pim2y0",styles:"font-family:Slack-Lato,appleLogo,sans-serif;font-size:15px;padding:8px 9px;& strong{background:skyblue;}& textarea{height:44px;padding:9px 10px!important;outline:none!important;border-radius:4px!important;resize:none!important;line-height:22px;border:none;}& ul{border:1px solid lightgray;max-height:200px;overflow-y:auto;padding:9px 10px;background:white;border-radius:4px;width:150px;}"}),p=(0,r.Z)("div",{target:"e11jvj892"})({name:"13ie2qx",styles:"position:relative;background:rgb(248, 248, 248);height:41px;display:flex;border-top:1px solid rgb(221, 221, 221);align-items:center;border-bottom-left-radius:4px;border-bottom-right-radius:4px"}),d=(0,r.Z)("button",{target:"e11jvj891"})({name:"xrrdm2",styles:"position:absolute;right:5px;top:5px"}),c=(0,r.Z)("button",{target:"e11jvj890"})("padding:4px 20px;background:transparent;border:none;display:flex;align-items:center;color:rgb(28, 29, 28);width:100%;& img{margin-right:5px;}",(({focus:t})=>t&&"\n    background: #1264a3;\n    color: white;\n  "),";");var u=n(8100),g=n(3564),x=n(5977),m=n(6182),h=n.n(m),b=n(9367),f=n.n(b),y=n(917);function Z({chat:t,onSubmitForm:e,onChangeChat:n,placeholder:r}){const{workspace:m}=(0,x.UO)(),{data:b}=(0,u.ZP)(`/api/workspaces/${m}/members`,g._),Z=(0,a.useRef)(null),k=(0,a.useCallback)((t=>{"Enter"!==t.key||t.shiftKey||(t.preventDefault(),e(t))}),[e]),v=(0,a.useCallback)(((t,e,n,a,r)=>b?(0,y.tZ)(c,{focus:r},(0,y.tZ)("img",{src:h().url(b[a].email,{s:"20px",d:"retro"}),alt:b[a].nickname}),(0,y.tZ)("span",null,n)):null),[b]);return(0,a.useEffect)((()=>{Z.current&&f()(Z.current)}),[]),(0,y.tZ)(i,null,(0,y.tZ)(s,{onSubmit:e},(0,y.tZ)(l,{id:"editor-chat",value:t,onKeyPress:k,onChange:n,inputRef:Z,placeholder:r,allowSuggestionsAboveCursor:!0},(0,y.tZ)(o.p,{appendSpaceOnAdd:!0,trigger:"@",data:b?.map((t=>({id:t.id,display:t.nickname})))||[],renderSuggestion:v})),(0,y.tZ)(p,null,(0,y.tZ)(d,{className:"c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send"+(t?.trim()?"":" c-texty_input__button--disabled"),"data-qa":"texty_send_button","aria-label":"Send message","data-sk":"tooltip_parent",type:"submit",disabled:!t.trim()},(0,y.tZ)("i",{className:"c-icon c-icon--paperplane-filled","area-hidden":"true"})))))}const k=a.memo(Z)},9419:(t,e,n)=>{"use strict";n.d(e,{Z:()=>k});var a=n(7294),r=n(5366);const o=(0,r.Z)("div",{target:"eqsl8t62"})({name:"g76wpd",styles:"width:100%;display:flex;height:calc(100vh - 236px);overflow:auto;margin-bottom:20px;border:1px solid #eee"}),i=(0,r.Z)("section",{target:"eqsl8t61"})({name:"10x3onk",styles:"width:100%;margin-top:20px;padding:0 20px;border-top:1px solid #eee"}),s=(0,r.Z)("div",{target:"eqsl8t60"})({name:"16cu5ak",styles:"display:flex;justify-content:center;flex:1;width:100%;position:sticky;top:14px;& button{font-weight:bold;font-size:13px;height:28px;line-height:27px;padding:0 16px;z-index:2;--saf-0:rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);box-shadow:0 0 0 1px var(--saf-0),0 1px 3px 0 rgba(0, 0, 0, 0.08);border-radius:24px;position:relative;top:-13px;background:white;border:none;outline:none;}"}),l=(0,r.Z)("div",{target:"eruenqx0"})({name:"2yhi1c",styles:"display:flex;padding:8px 20px;&:hover{background:#eee;}& .chat-img{display:flex;width:36px;margin-right:8px;& img{width:36px;height:36px;}}& .chat-text{display:flex;flex-wrap:wrap;flex:1;& p{flex:0 0 100%;margin:0;}}& .chat-user{display:flex;flex:0 0 100%;align-items:center;&>b{margin-right:5px;}&>span{font-size:12px;}}& a{text-decoration:none;color:deepskyblue;}"});var p=n(6182),d=n.n(p),c=n(7484),u=n.n(c),g=n(3727),x=n(5977),m=n(8817),h=n(917);function b({data:t}){const{workspace:e}=(0,x.UO)(),n="Sender"in t?t.Sender:t.User,r=(0,a.useMemo)((()=>(0,m.Z)({pattern:/@\[(.+?)]\((\d+?)\)|\n/g,decorator(t,n){const a=t.match(/@\[(.+?)]\((\d+?)\)/);return a?(0,h.tZ)(g.rU,{key:t+n,to:`/workspace/${e}/dm/${a[2]}`},"@",a[1]):(0,h.tZ)("br",{key:n})},input:t.content})),[t.content,e]);return(0,h.tZ)(l,null,(0,h.tZ)("div",{className:"chat-img"},(0,h.tZ)("img",{src:d().url(n.nickname,{s:"36px",d:"retro"}),alt:n.nickname})),(0,h.tZ)("div",{className:"chat-text"},(0,h.tZ)("div",{className:"chat-user"},(0,h.tZ)("b",null,n.nickname),(0,h.tZ)("span",null,u()(t.createdAt).format("h:mm A"))),(0,h.tZ)("p",null,r)))}const f=a.memo(b);var y=n(1298);function Z({chatSections:t,scrollbarRef:e,setSize:n,isReachingEnd:r}){const l=(0,a.useCallback)((t=>{0!==t.scrollTop||r||(console.log("가장 위"),n((t=>t+1)).then((()=>{e.current?.scrollTop(e.current?.getScrollHeight()-t.scrollHeight)})))}),[r,e,n]);return(0,h.tZ)(o,null,(0,h.tZ)(y.$B,{autoHide:!0,ref:e,onScrollFrame:l},Object.entries(t).map((([t,e])=>(0,h.tZ)(i,{className:`section-${t}`,key:t},(0,h.tZ)(s,null,(0,h.tZ)("button",null,t)),e.map((t=>(0,h.tZ)(f,{key:t.id,data:t}))))))))}const k=a.memo(Z)},8667:(t,e,n)=>{"use strict";n.d(e,{Z:()=>o});var a=n(7484),r=n.n(a);function o(t){const e={};return t.forEach((t=>{const n=r()(t.createdAt).format("YYYY-MM-DD");Array.isArray(e[n])?e[n].push(t):e[n]=[t]})),e}}}]);