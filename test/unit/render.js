import "mocha-sinon";
import { sync as isDirectorySync } from "is-directory";
import { sync as rimrafSync } from "rimraf";
import { expect } from "chai";
import { existsSync, unlinkSync } from "fs";
import { sync as globSync } from "glob";
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

        expect(console.log.calledWith("rendering /..."));
        expect(console.log.calledWith("rendered"));
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
});
