import { sync as isDirectorySync } from "is-directory";
import * as Joi from "@hapi/joi";
import * as puppeteer from "puppeteer";
import { isAbsolute } from "path";
import { sync as mkdirpSync } from "mkdirp";
import { writeFileSync } from "fs";
import Options from "./Options";

class Hypercharged {
    public port: string;
    public folder: string;
    public createFolderIfNotExist: Boolean;
    public baseUrl: string;

    protected options: Options;
    protected urls: Array<string>;
    protected callbacks: Object;
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
     * @throws {Error} if the parameter "urls" is not valid.
     */
    public addUrls(urls: Array<string>): Hypercharged {
        const { value, error } = Joi.array()
            .required()
            .items(Joi.string())
            .validate(urls);

        if (error) {
            throw new Error(error.message);
        }

        for (const url of urls) {
            this.addUrl(url);
        }

        return this;
    }

    /**
     * Returns true if the url is in the list of the urls of the Hypercharged instance, else returns false.
     *
     * @param {String} url
     * @return {Boolean}
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

                await this.callbacks[url](page);

                const content = await page.content();

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
     */
    public enableDebug(): Hypercharged {
        this.debug = true;

        return this;
    }

    /**
     * Set the debug mode to false. This will prevent printing additional information in the console.
     *
     * @return {Hypercharged}
     */
    public disableDebug(): Hypercharged {
        this.debug = false;

        return this;
    }
}

export default Hypercharged;
