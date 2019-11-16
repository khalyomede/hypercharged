import { expect } from "chai";
import Hypercharged from "../../lib/index";

describe(".hasUrls()", function() {
    it("should return true if all the urls have been added", function() {
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
                .hasUrls(["/", "/contact-us"]),
        ).to.be.true;
    });

    it("should return false if not all the urls have been added", function() {
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
                .hasUrls(["/", "/pricing"]),
        ).to.be.false;
    });

    it("should throw an error if called without parameters", function() {
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
            }).hasUrls();
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
            }).hasUrls(42);
        }).to.throw(Error, `"value" must be an array`);
    });

    it("should throw an Error if the parameters urls is not an Array of Strings", function() {
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
            }).hasUrls(["/", "/about", 42]);
        }).to.throw(Error, `"[2]" must be a string`);
    });
});
