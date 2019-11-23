import "mocha-sinon";
import { sync as isDirectorySync } from "is-directory";
import { sync as rimrafSync } from "rimraf";
import { expect } from "chai";
import { unlinkSync, readFileSync, writeFileSync } from "fs";
import { sync as globSync } from "glob";
import { JSDOM } from "jsdom";
import mkdirp, { sync as mkdirpSync } from "mkdirp";
import Hypercharged from "../../lib/index";
import browserSync from "browser-sync";

before(function() {
    const browser = browserSync.create("instance1");

    browser.init({
        server: {
            baseDir: __dirname + "/website",
        },
        open: false,
        port: 3000,
    });
});

after(function() {
    browserSync.get("instance1").exit();
});

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

    if (isDirectorySync(__dirname + "/website")) {
        rimrafSync(__dirname + "/website");
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

        const html = `<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
					<title>My website</title>
				</head>
				<body>
					<h1>Home page</h1>	
				</body>
			</html>`;

        mkdirpSync(__dirname + "/website");
        writeFileSync(__dirname + "/website/index.html", html);

        await new Hypercharged({
            input: {
                url: "http://localhost:3000",
            },
            output: {
                folder: {
                    path: __dirname,
                },
            },
        })
            .addUrl("/")
            .render();

        expect(
            readFileSync(__dirname + "/index.html")
                .toString()
                .replace(/\n|\t/gm, ""),
        ).to.be.equal(html.replace(/\n|\t/gm, ""));
    });

    it("should render sub pages", async function() {
        this.timeout(10000);

        const html = `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
					<title>My website</title>
				</head>
				<body>
					<h1>Avocado - Contact us</h1>
				</body>
			</html>
		`;

        mkdirpSync(__dirname + "/website/avocado/contact-us");
        writeFileSync(
            __dirname + "/website/avocado/contact-us/index.html",
            html,
        );

        await new Hypercharged({
            input: {
                url: "http://localhost:3000",
            },
            output: {
                folder: {
                    path: __dirname + "/prerendered",
                    createIfNotExist: true,
                },
            },
        })
            .addUrl("/avocado/contact-us")
            .render();

        expect(
            readFileSync(
                __dirname + "/prerendered/avocado/contact-us/index.html",
            )
                .toString()
                .replace(/\n|\t/gm, ""),
        ).to.be.equal(html.replace(/\n|\t/gm, ""));
    });

    it("should print debug informations", async function() {
        this.timeout(10000);

        mkdirpSync(__dirname + "/website");
        writeFileSync(
            __dirname + "/website/index.html",
            `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
					<title>My website</title>
				</head>
				<body>
					<h1>Home</h1>
				</body>
			</html>
		`,
        );

        await new Hypercharged({
            input: {
                url: "http://localhost:3000",
            },
            output: {
                folder: {
                    path: __dirname,
                },
            },
        })
            .addUrl("/")
            .enableDebug()
            .render();

        expect(console.log.calledWith("rendering /...")).to.be.true;
        expect(console.log.calledWith("rendered")).to.be.true;
    });

    it("should print an error if the custom algorithm to put the web page on hold has thrown an exception", async function() {
        this.timeout(10000);

        mkdirp(__dirname + "/website");
        writeFileSync(__dirname + "/website/index.html", "");

        await new Hypercharged({
            input: {
                url: "http://localhost:3000",
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

        mkdirpSync(__dirname + "/website");
        writeFileSync(__dirname + "/website/index.html", "");

        await new Hypercharged({
            input: {
                url: "http://localhost:3000",
            },
            output: {
                folder: {
                    path: __dirname + "/prerendered",
                    createIfNotExist: true,
                },
            },
        })
            .addUrl("/")
            .render();

        expect(isDirectorySync(__dirname + "/prerendered")).to.be.true;
    });

    it("should remove all the script tags", async function() {
        this.timeout(10000);

        mkdirpSync(__dirname + "/website");
        writeFileSync(
            __dirname + "/website/index.html",
            `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
					<title>My website</title>
					<link rel="preload" as="script" href="https://unpkg.com/vuex" />
				</head>
				<body>
					<h1>Home</h1>
					<script type="text/javascript">
						console.log("hello world");
					</script>
					<script type="text/javascript" src="https://unpkg.com/vue"></script>
					<script src="https://unpkg.com/vue-router"></script>
				</bodt>
			</html>
		`,
        );

        await new Hypercharged({
            input: {
                url: "http://localhost:3000",
            },
            output: {
                folder: {
                    path: __dirname + "/prerendered",
                    createIfNotExist: true,
                },
            },
        })
            .addUrl("/")
            .render();

        const content = readFileSync(
            __dirname + "/prerendered/index.html",
        ).toString();

        const jsdom = new JSDOM(content);

        const scripts = jsdom.window.document.querySelectorAll(
            "script:not([type]), script[type='text/javascript'], link[as='script']",
        );

        expect(scripts).to.be.empty;
    });

    it("should print in the console that the page logged some errors if it did (and the debug mode is enabled)", async function() {
        this.timeout(10000);

        mkdirp(__dirname + "/website");
        writeFileSync(
            __dirname + "/website/index.html",
            `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
					<title>My website</title>
					<script type="text/javascript">
						const a = 42;
						const a = 43; // should throw "Uncaught SyntaxError: Identifier 'a' has already been declared"
					</script>
				</head>
				<body>
					<h1>Home</h1>
				</body>
			</html>
		`,
        );

        await new Hypercharged({
            input: {
                url: "http://localhost:3000",
            },
            output: {
                folder: {
                    path: __dirname + "/prerendered",
                    createIfNotExist: true,
                },
            },
        })
            .addUrl("/")
            .enableDebug()
            .render();

        expect(
            console.log.calledWith(
                "an error have been detected in the console while rendering your page, it has been printed below",
            ),
        ).to.be.true;
    });
});
