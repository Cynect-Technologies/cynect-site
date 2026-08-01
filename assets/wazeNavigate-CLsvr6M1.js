import{c as u,b5 as c}from"./index-BVCJmeMd.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]],N=u("Navigation",m),l=n=>{const e=Number(n);return Number.isFinite(e)?e:null},g=({lat:n,lon:e,address:i,name:a})=>{const s=l(n),r=l(e),t=new URLSearchParams;if(s!==null&&r!==null){const o=[a,i].filter(Boolean).join(" ").trim();o&&t.set("q",o),t.set("ll",`${s},${r}`),t.set("navigate","yes"),t.set("zoom","17")}else{const o=[a,i].filter(Boolean).join(" ").trim();if(!o)return null;t.set("q",o),t.set("navigate","yes")}return t.set("utm_source","dogo"),`https://waze.com/ul?${t.toString()}`},f=n=>{const e=g(n||{});e&&c({url:e,type:"map_navigation"})};export{N,f as n};
