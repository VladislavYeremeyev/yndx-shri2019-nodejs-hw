parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Focm":[function(require,module,exports) {
function n(n){return t(n)||e(n)||o()}function o(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function e(n){if(Symbol.iterator in Object(n)||"[object Arguments]"===Object.prototype.toString.call(n))return Array.from(n)}function t(n){if(Array.isArray(n)){for(var o=0,e=new Array(n.length);o<n.length;o++)e[o]=n[o];return e}}document.addEventListener("DOMContentLoaded",function(){var o=document.querySelectorAll(".DropdownBlock");o.forEach(function(n){return n.addEventListener("click",function(e){n.classList.contains("DropdownBlock_opened")?(document.body.style.overflow="initial",n.classList.remove("DropdownBlock_opened")):(document.body.style.overflow="hidden",n.classList.add("DropdownBlock_opened")),Array.from(o).filter(function(o){return o!==n}).forEach(function(n){n.classList.contains("DropdownBlock_opened")&&n.classList.remove("DropdownBlock_opened")}),e.stopPropagation()})}),window.addEventListener("click",function(){Array.from(o).forEach(function(n){n.classList.contains("DropdownBlock_opened")&&(n.classList.remove("DropdownBlock_opened"),document.body.style.overflow="initial")})}),document.querySelectorAll(".TabMenu-Tab").forEach(function(o){return o.addEventListener("click",function(){n(o.parentElement.children).filter(function(n){return n!=o}).forEach(function(n){n.classList.remove("TabMenu-Tab_active")}),o.classList.add("TabMenu-Tab_active")})})});
},{}]},{},["Focm"], null)
//# sourceMappingURL=/src.460bbf29.js.map