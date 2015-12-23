/**
 * HTML5本地存储
 * @author gaoshi-github 
 * @version 1.0
 * @param storage.set {name,value,expires}		加本地存储数据，有效期是expries(单位秒)
 * @param storage.get  {name}        			获取本地存储数据
 * @param storage.remove  {name}        		删除本地数据
 * 
 * storage.set("name", "我是本地存储值");
 * console.log(storage.get("name"));
 * 
 */


!function(a,b){"use strict";"function"==typeof define&&define.amd?define(b):"object"==typeof exports?module.exports=b():b()}(this,function(){var d,e,a=function(){var a,c,b;try{b=new ActiveXObject("htmlfile"),b.open(),b.write('<iframe src="/favicon.ico"></iframe>'),b.close(),c=b.frames[0].document,a=c.createElement("div"),c.appendChild(a),a.addBehavior("#default#userData")}catch(d){}return{get:function(b){var c;a.load(b),c=a.getAttribute(b);try{c=JSON.parse(c)}catch(d){}return c},set:function(b,c,d){if(d){var e=new Date;e.setTime(e.getTime()+1e3*d),a.expires=e.toUTCString()}a.setAttribute(b,JSON.stringify(c)),a.save(b)},remove:function(b){a.removeAttribute(b),a.save(b)}}},b=function(){var b,d,a=(new Date).getTime();for(key in localStorage){b=localStorage.getItem(key);try{b=JSON.parse(b)}catch(c){}Object.prototype.toString.call(b).toLowerCase().indexOf("array")>0&&(d=b[0].expires,d&&/^\d{13,}$/.test(d)&&a>=d&&localStorage.removeItem(key))}return{get:function(a){var d,e,b=localStorage.getItem(a);if(!b)return null;try{b=JSON.parse(b)}catch(c){}if("object"!=typeof b)return b;if(d=b[0].expires,d&&/^\d{13,}$/.test(d)){if(e=(new Date).getTime(),e>=d)return localStorage.removeItem(a),null;b.shift()}return b[0]},set:function(a,b,c){var e,d=[];c&&(e=(new Date).getTime(),d.push({expires:e+1e3*c})),d.push(b),localStorage.setItem(a,JSON.stringify(d))},remove:function(a){localStorage.removeItem(a)}}},c={get:function(a){var c,b=document.cookie,d=b.indexOf(a+"="),e=b.indexOf(";",d);if(-1==e&&(e=b.length),d>-1){c=b.substring(d+a.length+1,e);try{c=JSON.parse(c)}catch(f){}return c}return null},set:function(a,b,c,d,e){var f,g;d=d||"/",f="",c&&(window.ActiveXObject?(g=new Date,g.setTime(g.getTime()+1e3*c),f="expires="+g.toGMTString()):f="max-age="+c),document.cookie=a+"="+JSON.stringify(b)+";"+f+";path="+d+";"+(e?"domain="+e:"")},remove:function(a,b,c){this.set(a,"",-1,b,c)}};return d=window.localStorage?b():a(),e={get:d.get,set:d.set,remove:d.remove,cookie:c}});





