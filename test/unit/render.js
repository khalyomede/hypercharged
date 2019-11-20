import "mocha-sinon";
import { sync as isDirectorySync } from "is-directory";
import { sync as rimrafSync } from "rimraf";
import { expect } from "chai";
import { existsSync, unlinkSync, readFileSync } from "fs";
import { sync as globSync } from "glob";
import { JSDOM } from "jsdom";
import Hypercharged from "../../lib/index";

afterEach(function() {
    const files = globSync(__dirname + "/**/*.html");

    for (const file of files) {
        unlinkSync(file);
    }

    if (isDirectorySync(__dirname + "/wiki")) {
        rimrafSync(__dirname + "/wiki");
    }

    if (isDirectorySync(__dirname + "/prerendered")) {
        rimrafSync(__dirname + "/prerendered");
    }
});

beforeEach(function() {
    this.sinon.stub(console, "log");
});

describe(".render()", function() {
    it("should return an instanceof Hypercharged", async function() {
        return expect(
            await new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: {
                        path: "./",
                    },
                },
            }).render(),
        ).to.be.instanceOf(Hypercharged);
    });

    it("should throw an Error if called without a parameter url that is not an Object", async function() {
        let catchedException = undefined;

        try {
            await new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: {
                        path: "./",
                    },
                },
            }).render(42);
        } catch (exception) {
            catchedException = exception;
        }

        expect(function() {
            if (catchedException) {
                throw catchedException;
            }
        }).to.throw(Error, `"value" must be of type object`);
    });

    it("should render the desired route", async function() {
        this.timeout(10000);

        await new Hypercharged({
            input: {
                url: "http://example.com",
            },
            output: {
                folder: {
                    path: __dirname,
                },
            },
        })
            .addUrl("/")
            .render();

        expect(existsSync(__dirname + "/index.html")).to.be.true;
    });

    it("should render sub pages", async function() {
        this.timeout(10000);

        await new Hypercharged({
            input: {
                url: "https://en.wikipedia.org/",
            },
            output: {
                folder: {
                    path: __dirname,
                },
            },
        })
            .addUrls(["/wiki/Wikipedia", "/wiki/Bylaws"])
            .render();

        expect(existsSync(__dirname + "/wiki/Wikipedia/index.html")).to.be.true;
        expect(existsSync(__dirname + "/wiki/Bylaws/index.html")).to.be.true;
    });

    it("should print debug informations", async function() {
        this.timeout(10000);

        await new Hypercharged({
            input: {
                url: "https://en.wikipedia.org",
            },
            output: {
                folder: {
                    path: __dirname,
                },
            },
        })
            .addUrl("/wiki/Main_Page")
            .enableDebug()
            .render();

        expect(console.log.calledWith("rendering /wiki/Main_Page...")).to.be
            .true;
        expect(console.log.calledWith("rendered")).to.be.true;
    });

    it("should print an error if the custom algorithm to put the web page on hold has thrown an exception", async function() {
        this.timeout(40000);

        await new Hypercharged({
            input: {
                url: "http://example.com",
            },
            output: {
                folder: {
                    path: __dirname,
                },
            },
        })
            .addUrl("/", async page => {
                await page.waitFor(".card", {
                    timeout: 1,
                });
            })
            .enableDebug()
            .render();

        expect(
            console.log.calledWith(
                "an error occurred while running your algorithm to put the web page on hold",
            ),
        ).to.be.true;
    });

    it("should create the folder if it does not exists", async function() {
        this.timeout(10000);

        await new Hypercharged({
            input: {
                url: "https://en.wikipedia.org/",
            },
            output: {
                folder: {
                    path: __dirname + "/prerendered",
                    createIfNotExist: true,
                },
            },
        })
            .addUrl("/wiki/Paris")
            .render();

        expect(isDirectorySync(__dirname + "/prerendered")).to.be.true;
    });

    it("should remove all the script tags", async function() {
        this.timeout(10000);

        await new Hypercharged({
            input: {
                url: "https://stackoverflow.com",
            },
            output: {
                folder: {
                    path: __dirname + "/prerendered",
                    createIfNotExist: true,
                },
            },
        })
            .addUrl(
                "/questions/13125817/how-to-remove-elements-that-were-fetched-using-queryselectorall",
            )
            .render();

        const content = readFileSync(
            __dirname +
                "/prerendered/questions/13125817/how-to-remove-elements-that-were-fetched-using-queryselectorall/index.html",
        ).toString();

        const jsdom = new JSDOM(content);

        const scripts = jsdom.window.document.querySelectorAll(
            "script:not([type]), script[type='text/javascript'], link[as='script']",
        );

        expect(scripts).to.be.empty;
    });
});
