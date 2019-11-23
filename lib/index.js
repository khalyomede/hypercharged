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

var Joi = require("@hapi/joi");

var fs_1 = require("fs");

var is_directory_1 = require("is-directory");

var jsdom_1 = require("jsdom");

var mkdirp_1 = require("mkdirp");

var path_1 = require("path");

var puppeteer = require("puppeteer");
/**
 * Prerenders urls of a website into a folder.
 */


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
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   */
  function Hypercharged(options) {
    var value = this._validateOptions(options);

    this.port = value.input.port;
    this.folder = value.output.folder.path;
    this.createFolderIfNotExist = value.output.folder.createIfNotExist;
    this.baseUrl = value.input.url;
    this.urls = [];
    this.callbacks = {};
    this.debug = false;
    this.renderOptions = {};
    this.currentRenderedPage = undefined;

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
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   *
   * hypercharged.addUrl("/");
   */


  Hypercharged.prototype.addUrl = function (url, callback) {
    var schema = Joi.string().required();

    var _a = schema.validate(url),
        value = _a.value,
        error = _a.error;

    if (error) {
      throw new TypeError(error.message);
    }

    var validation = Joi["function"]().validate(callback);

    if (validation.error) {
      throw new Error(validation.error.message);
    }

    if (!path_1.isAbsolute(url)) {
      throw new Error("expected parameter \"url\" to be an absolute path");
    }

    this.urls.push(value);

    if (callback instanceof Function) {
      this.callbacks[value] = callback;
    }

    return this;
  };
  /**
   * Add multiples urls to prerender.
   *
   * @param {Array<string>} urls
   * @param {Function} callback
   * @return {Hypercharged}
   * @throws {Error} if the parameter "urls" is not valid.
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   *
   * hypercharged.addUrls(["/", "/about", "/contact-us"]);
   */


  Hypercharged.prototype.addUrls = function (urls, callback) {
    this._validateUrls(urls);

    for (var _i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
      var url = urls_1[_i];
      this.addUrl(url, callback);
    }

    return this;
  };
  /**
   * Returns true if the url is in the list of the urls of the Hypercharged instance, else returns false.
   *
   * @param {String} url
   * @return {Boolean}
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   *
   * if (hypercharged.hasUrl("/")) {
   * 		console.log("this instance got the home url");
   * } else {
   * 		console.log("this instance does not have the home url yet");
   * }
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
  /**
   * Check if all the urls have been added for prerendering. Note that if at least one url have not been added, this method will return false.
   *
   * @param {Array<String>} urls
   * @return {Boolean}
   * @throws {Error} If the parameter "urls" is not an array of strings.
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   *
   * if (hypercharged.hasUrls(["/", "/about"])) {
   * 		console.log("this instance got the home and about urls");
   * } else {
   * 		console.log("this instance does not have the home and about urls yet");
   * }
   */


  Hypercharged.prototype.hasUrls = function (urls) {
    var _this = this;

    this._validateUrls(urls);

    return urls.filter(function (url) {
      return _this.hasUrl(url);
    }).length === urls.length;
  };
  /**
   * Removes the url of the list of urls of the Hypercharged instance.
   *
   * @param {String} urlToRemove
   * @return {Hypercharged}
   * @throws {Error} If the parameter "urlToRemove" is not a string.
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   *
   * hypercharged.removeUrl("/");
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
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   *
   * hypercharged.removeUrls(["/", "/about"]);
   */


  Hypercharged.prototype.removeUrls = function (urls) {
    this._validateUrls(urls);

    for (var _i = 0, urls_2 = urls; _i < urls_2.length; _i++) {
      var url = urls_2[_i];
      this.removeUrl(url);
    }

    return this;
  };
  /**
   * Render the urls into the folder you chose when creating this instance.
   *
   * @param {Object} options
   * @return {Promise<Hypercharged>}
   * @throws {Error} If the parameter "options" is not an object.
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   *
   * (async () => {
   * 		await hypercharged.render();
   * })();
   */


  Hypercharged.prototype.render = function (options) {
    if (options === void 0) {
      options = {};
    }

    return __awaiter(this, void 0, void 0, function () {
      var _a, value, error, browser, page, _i, _b, url, exception_1, callback, exception_2, content;

      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _a = Joi.object().validate(options), value = _a.value, error = _a.error;

            if (error) {
              throw new Error(error.message);
            }

            if (!(this.urls.length > 0)) return [3
            /*break*/
            , 17];
            this.renderOptions = options;
            return [4
            /*yield*/
            , this._getBrowser()];

          case 1:
            browser = _c.sent();
            return [4
            /*yield*/
            , browser.newPage()];

          case 2:
            page = _c.sent();

            if (this.debug) {
              page.on("pageerror", function (pageError) {
                /* tslint:disable:no-console */
                console.log("an error have been detected in the console while rendering your page, it has been printed below");
                console.log(pageError);
                /* tslint:enable:no-console */
              });
            }

            _i = 0, _b = this.urls;
            _c.label = 3;

          case 3:
            if (!(_i < _b.length)) return [3
            /*break*/
            , 14];
            url = _b[_i];

            if (this.debug) {
              /* tslint:disable:no-console */
              console.log("rendering " + url + "...");
              /* tslint:enable:no-console */
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
              /* tslint:disable:no-console */
              console.log("failed to connect to the page");
              console.log(exception_1);
              /* tslint:enable:no-console */
            }

            return [3
            /*break*/
            , 13];

          case 7:
            if (!(url in this.callbacks)) return [3
            /*break*/
            , 11];
            callback = this.callbacks[url];
            if (!(callback instanceof Function)) return [3
            /*break*/
            , 11];
            _c.label = 8;

          case 8:
            _c.trys.push([8, 10,, 11]);

            return [4
            /*yield*/
            , callback(page)];

          case 9:
            _c.sent();

            return [3
            /*break*/
            , 11];

          case 10:
            exception_2 = _c.sent();

            if (this.debug) {
              /* tslint:disable:no-console */
              console.log("an error occurred while running your algorithm to put the web page on hold");
              console.log(exception_2);
              /* tslint:enable:no-console */
            }

            return [3
            /*break*/
            , 13];

          case 11:
            this.currentRenderedPage = page;
            return [4
            /*yield*/
            , this._getPageContent()];

          case 12:
            content = _c.sent();
            mkdirp_1.sync(this.folder + "/" + url);
            fs_1.writeFileSync(this.folder + "/" + url + "/index.html", content);

            if (this.debug) {
              /* tslint:disable:no-console */
              console.log("rendered");
              /* tslint:enable:no-console */
            }

            _c.label = 13;

          case 13:
            _i++;
            return [3
            /*break*/
            , 3];

          case 14:
            return [4
            /*yield*/
            , page.close()];

          case 15:
            _c.sent();

            return [4
            /*yield*/
            , browser.close()];

          case 16:
            _c.sent();

            _c.label = 17;

          case 17:
            return [2
            /*return*/
            , this];
        }
      });
    });
  };
  /**
   * Sets the debug mode. If set to true, this will print additional information like which page is being rendered, in the console.
   *
   * @param {Boolean} debugMode
   * @return {Hypercharged}
   * @throws {Error} If the parameter "debugMode" is not a boolean.
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   *
   * hypercharged.setDebug(true);
   */


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
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   *
   * hypercharged.enableDebug();
   */


  Hypercharged.prototype.enableDebug = function () {
    this.debug = true;
    return this;
  };
  /**
   * Set the debug mode to false. This will prevent printing additional information in the console.
   *
   * @return {Hypercharged}
   * @since 0.1.0
   * @example
   * const hypercharged = new Hypercharged({
   * 		input: {
   * 			url: "http://example.com"
   * 		},
   * 		output: {
   * 			folder: {
   * 				path: __dirname
   * 			}
   * 		}
   * });
   *
   * hypercharged.disableDebug();
   */


  Hypercharged.prototype.disableDebug = function () {
    this.debug = false;
    return this;
  };
  /**
   * Throws an exception if the parameter is not an Array of Strings.
   *
   * @param {Array<String>} urls
   * @return {Void}
   * @throws {Error} If the parameter is undefined.
   * @throws {Error} If the parameter is not an Array.
   * @throws {Error} If the parameter is not an Array of Strings.
   */


  Hypercharged.prototype._validateUrls = function (urls) {
    var _a = Joi.array().required().items(Joi.string()).validate(urls),
        value = _a.value,
        error = _a.error;

    if (error) {
      throw new Error(error.message);
    }
  };
  /**
   * Throws an exception if the parameter is not compatible with the definition of an Options.
   *
   * @param {Object} options
   * @param {Object} options.input
   * @param {String} options.input.url
   * @param {Number} options.input.port=3000
   * @param {Object} options.output
   * @param {Object} options.output.folder
   * @param {String} options.output.folder.path
   * @param {Boolean} options.output.folder.createIfNotExist
   */


  Hypercharged.prototype._validateOptions = function (options) {
    var schema = Joi.object({
      input: Joi.object({
        port: Joi.number().integer().min(1001)["default"](3000),
        url: Joi.string().required()
      }).required(),
      output: Joi.object({
        folder: Joi.object({
          createIfNotExist: Joi.boolean()["default"](false),
          path: Joi.string().required()
        }).required()
      }).required()
    }).required();

    var _a = schema.validate(options),
        value = _a.value,
        error = _a.error;

    if (error) {
      throw new Error(error.message);
    }

    return value;
  };
  /**
   * Returns an instance of Puppeteer's Browser, configured with the desired options.
   *
   * @return {Promise<Browser>}
   */


  Hypercharged.prototype._getBrowser = function () {
    return __awaiter(this, void 0, void 0, function () {
      var browser;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , puppeteer.launch(__assign({
              args: ["--start-fullscreen"],
              defaultViewport: {
                height: 0,
                width: 0
              }
            }, this.renderOptions))];

          case 1:
            browser = _a.sent();
            return [2
            /*return*/
            , browser];
        }
      });
    });
  };
  /**
   * Returns the content of the page being rendered.
   *
   * @return {Promise<String>}
   */


  Hypercharged.prototype._getPageContent = function () {
    return __awaiter(this, void 0, void 0, function () {
      var content, jsdom, scripts, _i, scripts_1, script, parent_1;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.currentRenderedPage === undefined) {
              return [2
              /*return*/
              , ""];
            }

            return [4
            /*yield*/
            , this.currentRenderedPage.content()];

          case 1:
            content = _a.sent();
            jsdom = new jsdom_1.JSDOM(content);
            scripts = Array.from(jsdom.window.document.querySelectorAll("script:not([type]), script[type='text/javascript'], link[as='script']"));

            for (_i = 0, scripts_1 = scripts; _i < scripts_1.length; _i++) {
              script = scripts_1[_i];
              parent_1 = script.parentNode;

              if (!parent_1) {
                continue;
              }

              parent_1.removeChild(script);
            }

            content = jsdom.serialize();
            return [2
            /*return*/
            , content];
        }
      });
    });
  };

  return Hypercharged;
}();

exports["default"] = Hypercharged;