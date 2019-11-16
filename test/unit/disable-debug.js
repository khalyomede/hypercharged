import { expect } from "chai";
import Hypercharged from "../../lib/index";

describe(".disableDebug", function() {
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
            }).disableDebug(),
        ).to.be.an.instanceOf(Hypercharged);
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
            }).disableDebug().debug,
        ).to.be.false;
    });
});
