import { sync as isDirectorySync } from "is-directory";
import * as Joi from "@hapi/joi";
import * as puppeteer from "puppeteer";
import { isAbsolute } from "path";
import { sync as mkdirpSync } from "mkdirp";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import Options from "./Options";

class Hypercharged {
    /**
     * Stores the port that given via the constructor.
     *
     * @since 0.1.0
     */
    public port: string;

    /**
     * Stores the folder path given via the constructor.
     *
     * @since 0.1.0
     */
    public folder: string;

    /**
     * Stores the create folder if not exist boolean given via the constructor.
     *
     * @since 0.1.0
     */
    public createFolderIfNotExist: Boolean;

    /**
     * Stores the website url to parse, given via the constructor.
     *
     * @since 0.1.0
     */
    public baseUrl: string;

    /**
     * @todo to remove
     */
    protected options: Options;

    /**
     * Stores the list of urls to render.
     *
     * @since 0.1.0
     */
    protected urls: Array<string>;

    /**
     * Stores a dictionnary that match the url and their callback, which are the puppeteer "Page" action to perform before rendering the url.
     *
     * @since 0.1.0
     */
    protected callbacks: Object;

    /**
     * Stores true if the user wants to see debug information on console, like which page is being rendered.
     *
     * @since 0.1.0
     */
    protected debug: boolean;

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
    public constructor(options: Options) {
        const schema = Joi.object({
            input: Joi.object({
                url: Joi.string().required(),
                port: Joi.number()
                    .integer()
                    .min(1001)
                    .default(3000),
            }).required(),
            output: Joi.object({
                folder: Joi.object({
                    path: Joi.string().required(),
                    createIfNotExist: Joi.boolean().default(false),
                }).required(),
            }).required(),
        }).required();

        const { value, error } = schema.validate(options);

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

        if (
            !this.createFolderIfNotExist &&
            !isDirectorySync(options.output.folder.path)
        ) {
            throw new Error(`directory does not exist`);
        }

        if (this.createFolderIfNotExist) {
            mkdirpSync(this.folder);
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
    public addUrl(
        url: string,
        callback: Function = function() {},
    ): Hypercharged {
        const schema = Joi.string().required();

        const { value, error } = schema.validate(url);

        if (error) {
            throw new TypeError(error.message);
        }

        const validation = Joi.function()
            .required()
            .validate(callback);

        if (validation.error) {
            throw new Error(validation.error.message);
        }

        if (!isAbsolute(url)) {
            throw new Error(`expected parameter "url" to be an absolute path`);
        }

        this.urls.push(value);
        this.callbacks[value] = callback;

        return this;
    }

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
    public addUrls(
        urls: Array<string>,
        callback: Function = function() {},
    ): Hypercharged {
        const { value, error } = Joi.array()
            .required()
            .items(Joi.string())
            .validate(urls);

        if (error) {
            throw new Error(error.message);
        }

        for (const url of urls) {
            this.addUrl(url, callback);
        }

        return this;
    }

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
    public hasUrl(url: string): Boolean {
        const { value, error } = Joi.string()
            .required()
            .validate(url);

        if (error) {
            throw new Error(error.message);
        }

        if (!isAbsolute(url)) {
            throw new Error(`parameter "url" should be an absolute path`);
        }

        return this.urls.includes(url);
    }

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
    public hasUrls(urls: Array<string>): Boolean {
        const { value, error } = Joi.array()
            .required()
            .items(Joi.string())
            .validate(urls);

        if (error) {
            throw new Error(error.message);
        }

        return urls.filter(url => this.hasUrl(url)).length === urls.length;
    }

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
    public removeUrl(urlToRemove: string): Hypercharged {
        const { value, error } = Joi.string()
            .required()
            .validate(urlToRemove);

        if (error) {
            throw new Error(error.message);
        }

        if (!isAbsolute(urlToRemove)) {
            throw new Error(`"value" must be an absolute path`);
        }

        this.urls = this.urls.filter(url => url !== urlToRemove);

        return this;
    }

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
    public removeUrls(urls: Array<string>): Hypercharged {
        if (!Array.isArray(urls)) {
            throw new Error(`expected parameter "urls" to be an Array`);
        }

        for (const url of urls) {
            this.removeUrl(url);
        }

        return this;
    }

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
    public async render(options: Object = {}): Promise<Hypercharged> {
        const { value, error } = Joi.object().validate(options);

        if (error) {
            throw new Error(error.message);
        }

        if (this.urls.length > 0) {
            const browser = await puppeteer.launch({
                defaultViewport: {
                    width: 0,
                    height: 0,
                },
                args: ["--start-fullscreen"],
                ...options,
            });

            const page = await browser.newPage();

            for (const url of this.urls) {
                if (this.debug) {
                    console.log(`rendering ${url}...`);
                }

                try {
                    await page.goto(`${this.baseUrl}${url}`);
                } catch (exception) {
                    if (this.debug) {
                        console.log(`failed to connect to the page`);
                        console.log(exception);
                    }

                    continue;
                }

                try {
                    await this.callbacks[url](page);
                } catch (exception) {
                    if (this.debug) {
                        console.log(
                            "an error occurred while running your algorithm to put the web page on hold",
                        );
                        console.log(exception);
                    }

                    continue;
                }

                let content = await page.content();
                const jsdom = new JSDOM(content);

                const scripts = jsdom.window.document.querySelectorAll(
                    "script:not([type]), script[type='text/javascript'], link[as='script']",
                );

                for (const script of scripts) {
                    const parent = script.parentNode;

                    if (!parent) {
                        continue;
                    }

                    parent.removeChild(script);
                }

                content = jsdom.serialize();

                mkdirpSync(`${this.folder}/${url}`);
                writeFileSync(`${this.folder}/${url}/index.html`, content);

                if (this.debug) {
                    console.log(`rendered`);
                }
            }

            await page.close();
            await browser.close();
        }

        return this;
    }

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
    public setDebug(debugMode: boolean): Hypercharged {
        const { value, error } = Joi.boolean()
            .required()
            .validate(debugMode);

        if (error) {
            throw new Error(error.message);
        }

        this.debug = debugMode;

        return this;
    }

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
    public enableDebug(): Hypercharged {
        this.debug = true;

        return this;
    }

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
    public disableDebug(): Hypercharged {
        this.debug = false;

        return this;
    }
}

export default Hypercharged;
