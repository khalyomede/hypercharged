import { expect } from "chai";
import Hypercharged from "../../lib/index";

describe(".setDebug()", function() {
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
            }).setDebug(true),
        ).to.be.an.instanceOf(Hypercharged);
    });

    it("should set the debug property to true", function() {
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
            }).setDebug(true).debug,
        ).to.be.true;
    });

    it("should set the debug property to false", function() {
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
            }).setDebug(false).debug,
        ).to.be.false;
    });

    it("should throw an Error if called without arguments", function() {
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
            }).setDebug();
        }).to.throw(Error, `"value" is required`);
    });

    it("should throw an Error if the parameter debugMode is not a Boolean", function() {
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
            }).setDebug(42);
        }).to.throw(Error, `"value" must be a boolean`);
    });
});
