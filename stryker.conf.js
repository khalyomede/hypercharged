module.exports = function(config) {
    config.set({
        mutator: "javascript",
        packageManager: "yarn",
        reporters: ["clear-text", "progress"],
        testRunner: "mocha",
        transpilers: [],
        testFramework: "mocha",
        coverageAnalysis: "perTest",
        mutate: ["lib/index.js"],
        mochaOptions: {
            // Optional mocha options
            spec: ["test/**/*.js"],
            ui: "bdd",
            require: ["@babel/register"],
        },
    });
};
