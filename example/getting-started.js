const Hypercharged = require("../lib/index").default;

const hypercharged = new Hypercharged({
    input: {
        url: "http://example.com",
    },
    output: {
        folder: {
            path: __dirname + "/prerendered",
        },
    },
});

hypercharged.enableDebug();
hypercharged.addUrls(["/", "/about"]);

(async () => {
    await hypercharged.render();
})();
