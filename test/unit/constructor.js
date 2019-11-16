import { expect } from "chai";
import Hypercharged from "../../lib/index";

describe("constructor", function() {
    it("should return an instance of Hypercharged", function() {
        expect(
            new Hypercharged({
                input: { url: "http://example.com" },
                output: { folder: { path: "./" } },
            }),
        ).to.be.an.instanceOf(Hypercharged);
    });

    it("should throw a TypeError if constructed without arguments", function() {
        expect(function() {
            new Hypercharged();
        }).to.throw(Error, `"value" is required`);
    });

    it("should throw an Error if constructed with a non object option", function() {
        expect(function() {
            new Hypercharged(42);
        }).to.throw(Error, `"value" must be of type object`);
    });

    it("should throw an Error if constructed without input", function() {
        expect(function() {
            new Hypercharged({
                output: {
                    folder: {
                        path: "./",
                    },
                },
            });
        }).to.throw(Error, `"input" is required`);
    });

    it("should throw an Error if constructed with an input that is not an object", function() {
        expect(function() {
            new Hypercharged({
                input: 42,
            });
        }).to.throw(Error, `"input" must be of type object`);
    });

    it("should throw an Error if constructed with an options without folder", function() {
        expect(function() {
            new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {},
            });
        }).to.throw(Error, `"output.folder" is required`);
    });

    it("should throw an Error if constructed with an options.input without url", function() {
        expect(function() {
            new Hypercharged({
                input: {},
                output: {
                    folder: {
                        path: "./",
                    },
                },
            });
        }).to.throw(Error, `"input.url" is required`);
    });

    it("should throw an Error if constructed with an options.input.port that is not an Integer", function() {
        expect(function() {
            new Hypercharged({
                input: {
                    url: "http://example.com",
                    port: 4242.42,
                },
            });
        }).to.throw(Error, `"input.port" must be an integer`);
    });

    it("should throw an Error if constructed with an options.input.port that is below 1001", function() {
        expect(function() {
            new Hypercharged({
                input: {
                    url: "http://example.com",
                    port: 999,
                },
            });
        }).to.throw(Error, `"input.port" must be larger than or equal to 1001`);
    });

    it("should throw an Error if constructed with an options.url that is not a String", function() {
        expect(function() {
            new Hypercharged({
                input: {
                    url: 42,
                },
            });
        }).to.throw(Error, `"input.url" must be a string`);
    });

    it("should throw an Error if constructed with a non existing folder", function() {
        expect(function() {
            new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: {
                        path: "./foo",
                    },
                },
            });
        }).to.throw(Error, "directory does not exist");
    });

    it("should throw an Error if constructed with an options.output.folder that is not an object", function() {
        expect(function() {
            new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: 42,
                },
            });
        }).to.throw(Error, `"output.folder" must be of type object`);
    });

    it("should throw an Error if constructed with an options.output.createIfNotExist that is not a boolean", function() {
        expect(function() {
            new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: {
                        path: "./",
                        createIfNotExist: 42,
                    },
                },
            });
        }).to.throw(
            Error,
            `"output.folder.createIfNotExist" must be a boolean`,
        );
    });

    it("should autofill the port if constructed without port", function() {
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
        expect(hypercharged.port).to.be.equal(3000);
    });

    it("should autofill the output.folder.create with false", function() {
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
            }).createFolderIfNotExist,
        ).to.be.false;
    });

    it("should correctly fill the property createFolderIfNotExist with the value of output.folder.create", function() {
        expect(
            new Hypercharged({
                input: {
                    url: "http://example.com",
                },
                output: {
                    folder: {
                        path: "./",
                        createIfNotExist: true,
                    },
                },
            }).createFolderIfNotExist,
        ).to.be.true;
    });
});
