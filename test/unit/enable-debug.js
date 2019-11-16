import { expect } from "chai";
import Hypercharged from "../../lib/index";

describe(".enableDebug", function() {
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
            }).enableDebug(),
        ).to.be.an.instanceOf(Hypercharged);
    });

    it("should correctly set the debug mode to true", function() {
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
            }).enableDebug().debug,
        ).to.be.true;
    });
});
