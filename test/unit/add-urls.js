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
});
