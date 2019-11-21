import { expect } from "chai";
import Hypercharged from "../../lib/index";

describe(".removeUrls()", function() {
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
            }).removeUrls(["/", "/about"]),
        ).to.be.an.instanceOf(Hypercharged);
    });

    it("should remove the urls", function() {
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
            })
                .addUrls(["/", "/about", "/contact-us"])
                .removeUrls(["/about", "/"]).urls,
        ).to.be.deep.equal(["/contact-us"]);
    });

    it("should remove the urls even if some have not been added", function() {
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
            })
                .addUrls(["/", "/about", "/contact-us"])
                .removeUrls(["/about", "/pricing"]).urls,
        ).to.be.deep.equal(["/", "/contact-us"]);
    });

    it("should not remove any urls if no urls have been added", function() {
        const urls = ["/", "/about", "/contact-us"];

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
            })
                .addUrls(urls)
                .removeUrls(["/pricing", "/pricing/enterprise"]).urls,
        ).to.be.deep.equal(urls);
    });

    it("should throw an Error if called without parameters", function() {
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
            }).removeUrls();
        }).to.throw(Error, `"value" is required`);
    });

    it("should throw an Error if the parameter urls is not an Array", function() {
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
            }).removeUrls(42);
        }).to.throw(Error, `"value" must be an array`);
    });

    it("should throw an Error if the parameter urls is not an Array of only Strings", function() {
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
            }).removeUrls(["/", "/about", 42]);
        }).to.throw(Error, `"[2]" must be a string`);
    });
});
