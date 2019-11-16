import { expect } from "chai";
import Hypercharged from "../../lib/index";

describe(".removeUrl()", function() {
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
            }).removeUrl("/"),
        ).to.be.an.instanceOf(Hypercharged);
    });

    it("should remove the url if the parameter url is an url that have been added to the urls", function() {
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
                .removeUrl("/").urls,
        ).to.be.deep.equal(["/about", "/contact-us"]);
    });

    it("should not touch the existing urls if the parameter url has not been added to the urls", function() {
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
                .removeUrl("/pricing").urls,
        ).to.be.deep.equal(urls);
    });

    it("should throw an Error if the parameter url is not an absolute url", function() {
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
            }).removeUrl("pricing/enterprise");
        }).to.throw(Error, `"value" must be an absolute path`);
    });

    it("should throw an Error if the parameter url is an empty String", function() {
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
            }).removeUrl("");
        }).to.throw(Error, `"value" is not allowed to be empty`);
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
            }).removeUrl(42);
        }).to.throw(Error, `"value" must be a string`);
    });
});
