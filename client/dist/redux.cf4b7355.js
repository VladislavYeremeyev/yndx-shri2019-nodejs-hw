// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"mini-redux/Store.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Store =
/*#__PURE__*/
function () {
  function Store(reducer) {
    _classCallCheck(this, Store);

    this._state = undefined;
    this._listeners = [];
    this._reducer = reducer;
    this.dispatch({
      type: 'init'
    });
  }

  _createClass(Store, [{
    key: "getState",
    value: function getState() {
      return this._state;
    }
  }, {
    key: "dispatch",
    value: function dispatch(action) {
      if (typeof action === 'function') {
        action(this.dispatch.bind(this));
        return;
      }

      this._state = this._reducer(this._state, action);

      this._notify();
    }
  }, {
    key: "subscribe",
    value: function subscribe(cb) {
      this._listeners.push(cb);

      return function () {
        var index = this._listeners.indexOf(cb);

        this._listeners = this._listeners.splice(index, 1);
      };
    }
  }, {
    key: "_notify",
    value: function _notify() {
      var _this = this;

      this._listeners.forEach(function (listener) {
        listener(_this._state);
      });
    }
  }]);

  return Store;
}();

var _default = Store;
exports.default = _default;
},{}],"mini-redux/ActionTypes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ActionTypes = {
  INIT: 'init',
  SET_NAME: 'SET_NAME',
  SET_FILES: 'SET_FILES'
};
var _default = ActionTypes;
exports.default = _default;
},{}],"mini-redux/Reducer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ActionTypes = _interopRequireDefault(require("./ActionTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Reducer = function Reducer(state, action) {
  switch (action.type) {
    case _ActionTypes.default.SET_NAME:
      return _objectSpread({}, state, {
        name: action.payload
      });

    case _ActionTypes.default.SET_FILES:
      return _objectSpread({}, state, {
        files: action.files
      });

    case _ActionTypes.default.INIT:
    default:
      return {
        name: '',
        files: []
      };
  }
};

var _default = Reducer;
exports.default = _default;
},{"./ActionTypes":"mini-redux/ActionTypes.js"}],"mini-redux/View.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var View =
/*#__PURE__*/
function () {
  function View(el, store) {
    _classCallCheck(this, View);

    this._el = el;
    this._store = store;
    this.unsubscribe = store.subscribe(this._prepareRender.bind(this));

    this._prepareRender(store.getState());
  }

  _createClass(View, [{
    key: "_prepareRender",
    value: function _prepareRender(state) {
      this._el.innerHTML = this.render(state);
    }
  }, {
    key: "render",
    value: function render() {
      throw new Error('render should be overridden');
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._el.innerHTML = '';
      this.unsubscribe();
    }
  }]);

  return View;
}();

var _default = View;
exports.default = _default;
},{}],"mini-redux/Actions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFilesAction = exports.setNameAction = void 0;

var _ActionTypes = _interopRequireDefault(require("./ActionTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setNameAction = function setNameAction(name) {
  return {
    type: _ActionTypes.default.SET_NAME,
    payload: name
  };
};

exports.setNameAction = setNameAction;

var setFilesAction = function setFilesAction(files) {
  return {
    type: _ActionTypes.default.SET_FILES,
    files: files
  };
};

exports.setFilesAction = setFilesAction;
},{"./ActionTypes":"mini-redux/ActionTypes.js"}],"mini-redux/middleware.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFilesByName = void 0;

var _Actions = require("./Actions");

// import data from './filesData';
var findFilesByName = function findFilesByName(name) {
  return function (dispatch) {
    return fetch('http://localhost:3000/api/repos/redux-thunk/tree/master/').then(function (response) {
      return response.json();
    }).then(function (files) {
      var filteredFilesList = files.data.filter(function (file) {
        return file.toLowerCase().includes(name.toLowerCase());
      });
      dispatch((0, _Actions.setFilesAction)(filteredFilesList));
      dispatch((0, _Actions.setNameAction)(name));
    }).catch(function (err) {
      return console.log(err);
    }); // const filteredFilesList = data.filter(file => {
    // 	return file.name.toLowerCase().includes(name.toLowerCase());
    // }).map(file => file.name);
    // dispatch(setFilesAction(filteredFilesList));
    // dispatch(setNameAction(name));
  };
};

exports.findFilesByName = findFilesByName;
},{"./Actions":"mini-redux/Actions.js"}],"mini-redux/InputView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View"));

var _middleware = require("./middleware");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var InputView =
/*#__PURE__*/
function (_View) {
  _inherits(InputView, _View);

  function InputView(el, store) {
    var _this;

    _classCallCheck(this, InputView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputView).call(this, el, store));
    _this._onInput = _this._onInput.bind(_assertThisInitialized(_this));

    _this._el.addEventListener('input', _this._onInput);

    store.dispatch((0, _middleware.findFilesByName)(''));
    return _this;
  }

  _createClass(InputView, [{
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(InputView.prototype), "destroy", this).call(this);

      this._onInput.removeEventListener('input', this._onInput);
    }
  }, {
    key: "_onInput",
    value: function _onInput(event) {
      clearTimeout(this._throttling);
      var store = this._store;
      this._throttling = setTimeout(function () {
        store.dispatch((0, _middleware.findFilesByName)(event.target.value));
      }, 300);
    }
  }, {
    key: "render",
    value: function render() {
      return '';
    }
  }]);

  return InputView;
}(_View2.default);

var _default = InputView;
exports.default = _default;
},{"./View":"mini-redux/View.js","./middleware":"mini-redux/middleware.js"}],"mini-redux/FolderView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _View2 = _interopRequireDefault(require("./View"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FolderView =
/*#__PURE__*/
function (_View) {
  _inherits(FolderView, _View);

  function FolderView(el, store) {
    _classCallCheck(this, FolderView);

    return _possibleConstructorReturn(this, _getPrototypeOf(FolderView).call(this, el, store));
  }

  _createClass(FolderView, [{
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(FolderView.prototype), "destroy", this).call(this);
    }
  }, {
    key: "render",
    value: function render(_ref) {
      var files = _ref.files;
      var filesList = files.map(function (file) {
        return "\n\t\t\t\t\t<div class=\"Grid-Row Grid-Row_border_b Grid Grid_m-columns_12\">\n\t\t\t\t\t\t<div class=\"Grid-File Grid-Fraction Grid-Fraction_m-col_2\">\n\t\t\t\t\t\t\t<div class=\"FileIcon FileIcon_type_folder\">\n\t\t\t\t\t\t\t\t<svg width=\"12\" height=\"9\" viewBox=\"0 0 12 9\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n\t\t\t\t\t\t\t\t<path d=\"M10.875 1.5H6.375L4.875 0H1.125C0.492188 0 0 0.515625 0 1.125V7.875C0 8.50781 0.492188 9 1.125 9H10.875C11.4844 9 12 8.50781 12 7.875V2.625C12 2.01562 11.4844 1.5 10.875 1.5Z\" fill=\"black\"/>\n\t\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"Grid-FileName Grid-FileName_text_bold\">".concat(file, "</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"Grid-CommitHash Grid-Fraction Grid-Fraction_m-col_2\">\n\t\t\t\t\t\t\t<a href=\"#\" class=\"Link Link_color_blue\">d53dsv</a>\n\t\t\t\t\t\t\t<div class=\"Grid-CommitInfo\">by Alexey Besedin, 4 s ago</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"Grid-CommitMessage Grid-Fraction Grid-Fraction_m-col_4\">[vcs] move http to arc</div>\n\t\t\t\t\t\t<div class=\"Grid-Committer Grid-Fraction Grid-Fraction_m-col_2\">\n\t\t\t\t\t\t\t<span class=\"AuthorSpan\">author</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"Grid-UpdateDate Grid-Fraction Grid-Fraction Grid-Fraction_m-col_2 Grid-Fraction_text-align_right\">4 s ago</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t");
      }).join('');
      return filesList ? filesList : '';
    }
  }]);

  return FolderView;
}(_View2.default);

var _default = FolderView;
exports.default = _default;
},{"./View":"mini-redux/View.js"}],"redux.js":[function(require,module,exports) {
"use strict";

var _Store = _interopRequireDefault(require("./mini-redux/Store"));

var _Reducer = _interopRequireDefault(require("./mini-redux/Reducer"));

var _InputView = _interopRequireDefault(require("./mini-redux/InputView"));

var _FolderView = _interopRequireDefault(require("./mini-redux/FolderView"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  var store = new _Store.default(_Reducer.default);
  var inputElement = document.querySelector('.SearchInput');
  var filesTableContainer = document.querySelector('.Grid-Content');
  new _InputView.default(inputElement, store);
  new _FolderView.default(filesTableContainer, store);
});
},{"./mini-redux/Store":"mini-redux/Store.js","./mini-redux/Reducer":"mini-redux/Reducer.js","./mini-redux/InputView":"mini-redux/InputView.js","./mini-redux/FolderView":"mini-redux/FolderView.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "43959" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","redux.js"], null)
//# sourceMappingURL=/redux.cf4b7355.js.map