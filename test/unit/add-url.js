import { expect } from "chai";
import Hypercharged from "../../lib/index";

describe(".addUrl()", function() {
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
            }).addUrl("/"),
        ).to.be.an.instanceOf(Hypercharged);
    });

    it("should correctly add the url", function() {
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

        expect(hypercharged.addUrl("/").urls).to.deep.equal(["/"]);
    });

    it("should add the url if there already has some", function() {
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
            hypercharged.addUrls(["/", "/about"]).addUrl("/contact-us").urls,
        ).to.be.deep.equal(["/", "/about", "/contact-us"]);
    });

    it("should throw an Error if no parameter is given", function() {
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
            }).addUrl();
        }).to.throw(Error, `"value" is required`);
    });

    it("should throw an Error if the parameter is not a String", function() {
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
            }).addUrl(42);
        }).to.throw(Error, `"value" must be a string`);
    });

    it("should throw an Error if the parameter is empty", function() {
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
            }).addUrl("");
        }).to.throw(Error, `"value" is not allowed to be empty`);
    });

    it("should throw an Error if the parameter is not an absolute path", function() {
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
            }).addUrl("pricing/enterprise");
        }).to.throw(`expected parameter "url" to be an absolute path`);
    });
});
