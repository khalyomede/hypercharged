"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;

var is_directory_1 = require("is-directory");

var Joi = require("@hapi/joi");

var puppeteer = require("puppeteer");

var path_1 = require("path");

var mkdirp_1 = require("mkdirp");

var fs_1 = require("fs");

var Hypercharged =
/** @class */
function () {
  /**
   * Constructor.
   *
   * @param {Object} options
   * @param {String} options.folder
   * @param {Number} options.port
   * @param {String} options.url
   * @return {Hypercharged}
   * @throws {TypeError} If the options is not an object.
   * @throws {Error} If the options is not valid.
   */
  function Hypercharged(options) {
    var schema = Joi.object({
      input: Joi.object({
        url: Joi.string().required(),
        port: Joi.number().integer().min(1001)["default"](3000)
      }).required(),
      output: Joi.object({
        folder: Joi.object({
          path: Joi.string().required(),
          createIfNotExist: Joi.boolean()["default"](false)
        }).required()
      }).required()
    }).required();

    var _a = schema.validate(options),
        value = _a.value,
        error = _a.error;

    if (error) {
      throw new Error(error.message);
    }

    this.port = value.input.port;
    this.folder = value.output.folder.path;
    this.createFolderIfNotExist = value.output.folder.createIfNotExist;
    this.baseUrl = value.input.url;
    this.urls = [];
    this.callbacks = {};
    this.debug = false;

    if (!this.createFolderIfNotExist && !is_directory_1.sync(options.output.folder.path)) {
      throw new Error("directory does not exist");
    }

    if (this.createFolderIfNotExist) {
      mkdirp_1.sync(this.folder);
    }
  }
  /**
   * Add a page to prerender.
   *
   * @param {String} url
   * @return {Hypercharged}
   * @throws {TypeError} If the parameter "url" is not a string.
   */


  Hypercharged.prototype.addUrl = function (url, callback) {
    if (callback === void 0) {
      callback = function () {};
    }

    var schema = Joi.string().required();

    var _a = schema.validate(url),
        value = _a.value,
        error = _a.error;

    if (error) {
      throw new TypeError(error.message);
    }

    if (!path_1.isAbsolute(url)) {
      throw new Error("expected parameter \"url\" to be an absolute path");
    }

    this.urls.push(value);
    this.callbacks[value] = callback;
    return this;
  };
  /**
   * Add multiples urls to prerender.
   *
   * @param {Array<string>} urls
   * @throws {Error} if the parameter "urls" is not valid.
   */


  Hypercharged.prototype.addUrls = function (urls) {
    var _a = Joi.array().required().items(Joi.string()).validate(urls),
        value = _a.value,
        error = _a.error;

    if (error) {
      throw new Error(error.message);
    }

    for (var _i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
      var url = urls_1[_i];
      this.addUrl(url);
    }

    return this;
  };
  /**
   * Returns true if the url is in the list of the urls of the Hypercharged instance, else returns false.
   *
   * @param {String} url
   * @return {Boolean}
   */


  Hypercharged.prototype.hasUrl = function (url) {
    var _a = Joi.string().required().validate(url),
        value = _a.value,
        error = _a.error;

    if (error) {
      throw new Error(error.message);
    }

    if (!path_1.isAbsolute(url)) {
      throw new Error("parameter \"url\" should be an absolute path");
    }

    return this.urls.includes(url);
  };

  Hypercharged.prototype.hasUrls = function (urls) {
    var _this = this;

    var _a = Joi.array().required().items(Joi.string()).validate(urls),
        value = _a.value,
        error = _a.error;

    if (error) {
      throw new Error(error.message);
    }

    return urls.filter(function (url) {
      return _this.hasUrl(url);
    }).length === urls.length;
  };
  /**
   * Removes the url of the list of urls of the Hypercharged instance.
   *
   * @param {String} urlToRemove
   * @return {Hypercharged}
   */


  Hypercharged.prototype.removeUrl = function (urlToRemove) {
    var _a = Joi.string().required().validate(urlToRemove),
        value = _a.value,
        error = _a.error;

    if (error) {
      throw new Error(error.message);
    }

    if (!path_1.isAbsolute(urlToRemove)) {
      throw new Error("\"value\" must be an absolute path");
    }

    this.urls = this.urls.filter(function (url) {
      return url !== urlToRemove;
    });
    return this;
  };
  /**
   * Removes urls from the instance.
   *
   * @param {Array<string>} urls
   * @return {Hypercharged}
   * @throws {Error} If the parameter "urls" is not an Array
   */


  Hypercharged.prototype.removeUrls = function (urls) {
    if (!Array.isArray(urls)) {
      throw new Error("expected parameter \"urls\" to be an Array");
    }

    for (var _i = 0, urls_2 = urls; _i < urls_2.length; _i++) {
      var url = urls_2[_i];
      this.removeUrl(url);
    }

    return this;
  };

  Hypercharged.prototype.render = function (options) {
    if (options === void 0) {
      options = {};
    }

    return __awaiter(this, void 0, void 0, function () {
      var _a, value, error, browser, page, _i, _b, url, exception_1, exception_2, content;

      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _a = Joi.object().validate(options), value = _a.value, error = _a.error;

            if (error) {
              throw new Error(error.message);
            }

            if (!(this.urls.length > 0)) return [3
            /*break*/
            , 16];
            return [4
            /*yield*/
            , puppeteer.launch(__assign({
              defaultViewport: {
                width: 0,
                height: 0
              },
              args: ["--start-fullscreen"]
            }, options))];

          case 1:
            browser = _c.sent();
            return [4
            /*yield*/
            , browser.newPage()];

          case 2:
            page = _c.sent();
            _i = 0, _b = this.urls;
            _c.label = 3;

          case 3:
            if (!(_i < _b.length)) return [3
            /*break*/
            , 13];
            url = _b[_i];

            if (this.debug) {
              console.log("rendering " + url + "...");
            }

            _c.label = 4;

          case 4:
            _c.trys.push([4, 6,, 7]);

            return [4
            /*yield*/
            , page.goto("" + this.baseUrl + url)];

          case 5:
            _c.sent();

            return [3
            /*break*/
            , 7];

          case 6:
            exception_1 = _c.sent();

            if (this.debug) {
              console.log("failed to connect to the page");
              console.log(exception_1);
            }

            return [3
            /*break*/
            , 12];

          case 7:
            _c.trys.push([7, 9,, 10]);

            return [4
            /*yield*/
            , this.callbacks[url](page)];

          case 8:
            _c.sent();

            return [3
            /*break*/
            , 10];

          case 9:
            exception_2 = _c.sent();

            if (this.debug) {
              console.log("an error occurred while running your algorithm to put the web page on hold");
              console.log(exception_2);
            }

            return [3
            /*break*/
            , 12];

          case 10:
            return [4
            /*yield*/
            , page.content()];

          case 11:
            content = _c.sent();
            mkdirp_1.sync(this.folder + "/" + url);
            fs_1.writeFileSync(this.folder + "/" + url + "/index.html", content);

            if (this.debug) {
              console.log("rendered");
            }

            _c.label = 12;

          case 12:
            _i++;
            return [3
            /*break*/
            , 3];

          case 13:
            return [4
            /*yield*/
            , page.close()];

          case 14:
            _c.sent();

            return [4
            /*yield*/
            , browser.close()];

          case 15:
            _c.sent();

            _c.label = 16;

          case 16:
            return [2
            /*return*/
            , this];
        }
      });
    });
  };

  Hypercharged.prototype.setDebug = function (debugMode) {
    var _a = Joi.boolean().required().validate(debugMode),
        value = _a.value,
        error = _a.error;

    if (error) {
      throw new Error(error.message);
    }

    this.debug = debugMode;
    return this;
  };
  /**
   * Set the debug mode to true. This will print additional information like which page is being rendered, in the console.
   *
   * @return {Hypercharged}
   */


  Hypercharged.prototype.enableDebug = function () {
    this.debug = true;
    return this;
  };
  /**
   * Set the debug mode to false. This will prevent printing additional information in the console.
   *
   * @return {Hypercharged}
   */


  Hypercharged.prototype.disableDebug = function () {
    this.debug = false;
    return this;
  };

  return Hypercharged;
}();

exports["default"] = Hypercharged;