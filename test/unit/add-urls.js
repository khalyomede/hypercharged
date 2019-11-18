import { expect } from "chai";
import Hypercharged from "../../lib/index";

describe(".addUrls()", function() {
    it("should return an instance of Hypercharged", function() {
        expect(
            new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: {
                        path: "./",
                    },
                },
            }).addUrls(["/", "/about", "/contac-us"]),
        ).to.be.an.instanceOf(Hypercharged);
    });

    it("should add multiple urls", function() {
        const hypercharged = new Hypercharged({
            input: {
                url: "http://example.com",
            },
            output: {
                folder: {
                    path: "./",
                },
            },
        });
        const urls = ["/", "/about"];

        expect(hypercharged.addUrls(urls).urls).to.be.deep.equal(urls);
    });

    it("should add the same callback to all the newly added urls", function() {
        const callback = async page => page.waitForNavigation();

        expect(
            new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: {
                        path: "./",
                    },
                },
            }).addUrls(["/", "/about", "/contact-us"], callback).callbacks,
        ).to.be.deep.equal({
            "/": callback,
            "/about": callback,
            "/contact-us": callback,
        });
    });

    it("should add multiple urls if there is already some", function() {
        const hypercharged = new Hypercharged({
            input: {
                url: "http://example.com",
            },
            output: {
                folder: {
                    path: "./",
                },
            },
        });

        expect(
            hypercharged.addUrl("/").addUrls(["/about", "/contact-us"]).urls,
        ).to.be.deep.equal(["/", "/about", "/contact-us"]);
    });

    it("should attach the callback only to the newly created urls", function() {
        const callback = async page => page.waitForNavigation();
        const hypercharged = new Hypercharged({
            input: {
                url: "http://example.com",
            },
            output: {
                folder: {
                    path: "./",
                },
            },
        })
            .addUrls(["/", "/about"])
            .addUrls(["/contact-us", "/pricing"], callback);

        expect(hypercharged.callbacks["/"]).to.not.be.equal(callback);
        expect(hypercharged.callbacks["/about"]).to.not.be.equal(callback);
        expect(hypercharged.callbacks["/contact-us"]).to.be.equal(callback);
        expect(hypercharged.callbacks["/pricing"]).to.be.equal(callback);
    });

    it("should throw an Error if calling without parameters", function() {
        expect(function() {
            new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: {
                        path: "./",
                    },
                },
            }).addUrls();
        }).to.throw(Error, `"value" is required`);
    });

    it("should throw an Error if the parameter urls does not contain only Strings", function() {
        expect(function() {
            new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: {
                        path: "./",
                    },
                },
            }).addUrls(["/", "/about", 42]);
        }).to.throw(Error, `"[2]" must be a string`);
    });

    it("should throw an Error if the parameter callback is not of type Function", function() {
        expect(function() {
            new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: {
                        path: "./",
                    },
                },
            }).addUrls(["/", "/about"], 42);
        }).to.throw(Error, `"value" must be of type function`);
    });
});
