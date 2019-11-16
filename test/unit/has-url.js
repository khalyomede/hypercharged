import { expect } from "chai";
import Hypercharged from "../../lib/index";

describe(".hasUrl()", function() {
    it("should return true if the url has been added", function() {
        const hypercharged = new Hypercharged({
            input: {
                url: "http://example.com",
            },
            output: {
                folder: {
                    path: "./",
                },
            },
        }).addUrls(["/", "/about", "/contact-us"]);

        expect(hypercharged.hasUrl("/")).to.be.true;
    });

    it("should return false if the url has not been added", function() {
        const hypercharged = new Hypercharged({
            input: {
                url: "http://example.com",
            },
            output: {
                folder: {
                    path: "./",
                },
            },
        }).addUrls(["/", "/about", "/contact-us"]);

        expect(hypercharged.hasUrl("/pricing")).to.be.false;
    });

    it("should throw an Error if the url is not an absolute path", function() {
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
            }).hasUrl("pricing/enterprise");
        }).to.throw(Error, `parameter "url" should be an absolute path`);
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
            }).hasUrl();
        }).to.throw(Error, `"value" is required`);
    });

    it("should throw an Error if the parameter url is not a String", function() {
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
            }).hasUrl(42);
        }).to.throw(Error, `"value" must be a string`);
    });

    it("should throw an Error if the parameter is an empty url", function() {
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
            }).hasUrl("");
        }).to.throw(Error, `"value" is not allowed to be empty`);
    });
});
