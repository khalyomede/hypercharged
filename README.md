![](https://user-images.githubusercontent.com/15908747/69000199-29736380-08cc-11ea-8a69-b375da50f7da.png)

Generates a prerendered site from your original website.

[![npm](https://img.shields.io/npm/v/hypercharged)](https://www.npmjs.com/package/hypercharged) [![npm dev dependency version](https://img.shields.io/npm/dependency-version/hypercharged/dev/puppeteer)](https://www.npmjs.com/package/puppeteer) [![Build Status](https://travis-ci.com/khalyomede/hypercharged.svg?branch=master)](https://travis-ci.com/khalyomede/hypercharged) [![codecov](https://codecov.io/gh/khalyomede/hypercharged/branch/master/graph/badge.svg)](https://codecov.io/gh/khalyomede/hypercharged) [![Stryker mutation score](https://badge.stryker-mutator.io/github.com/khalyomede/hypercharged/master)](https://badge.stryker-mutator.io/github.com/khalyomede/hypercharged/master) [![Maintainability](https://api.codeclimate.com/v1/badges/fdd6b022afedcefeeefe/maintainability)](https://codeclimate.com/github/khalyomede/hypercharged/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/khalyomede/hypercharged/badge.svg?targetFile=package.json)](https://snyk.io/test/github/khalyomede/hypercharged?targetFile=package.json) [![NPM](https://img.shields.io/npm/l/hypercharged)](https://github.com/khalyomede/hypercharged/blob/master/LICENSE)

## Summary

-   [About](#about)
-   [Installation](#installation)
-   [Usage](#usage)

## About

I created this library because I used to exploit a home made tool to generate a prerendered website from my original single page application. This prerendered version would help me pass through the SEO issue caused by bots not being able to execute Javascript. The result let bots parse an HTML generated result that help them understand the content of my website without executing Javascript. To do so, I use to add an Apache rule to redirect bots to the prerendered version of my website.

However, the result can be used differently. I imagine for example to serve the prerendered result to **every** users, in order to reduce the Javascript parsing/execution time.

Open sourcing this project would eventually help me produce a better and more reliable library as I have in mind the community expectations.

## Installation

**Before starting**

`puppeteer` will install a supported Chrome executable. It can use additional space so you should be aware of it as it can be a problem on operating system running with a low storage.

If you need, you can use `puppeteer-core` and instruct it to use an existing Chrome instance. The only downside is if the version of your existing Chrome instance is not the same as the one puppeteer is tested, the behavior of this library will not be guaranteed anymore.

Learn more about the difference [here](https://github.com/GoogleChrome/puppeteer/blob/v2.0.0/docs/api.md#puppeteer-vs-puppeteer-core).

**Install the dependencies**

With npm:

```bash
npm install --save-dev puppeteer@2.* hypercharged
```

Or with Yarn:

```bash
yarn add --dev puppeteer@2.* hypercharged
```

## Usage

-   [1. Simple usage](#1-simple-usage)
-   [2. Create the output folder if it does not exist](#2-create-the-output-folder-if-it-does-not-exist)
-   [3. Generating multiple files](#3-generating-multiple-files)
-   [4. Using custom puppeteer command before starting to copy the HTML content](#4-using-custom-puppeteer-command-before-starting-to-copy-the-html-content)
-   [5. Passing options before rendering](#5-passing-options-before-rendering)
-   [6. Enable the debug mode to print what is Hypercharged doing](#6-enable-the-debug-mode-to-print-what-is-hypercharged-doing)

### 1. Simple usage

In this example, we will render the home page of [http://example.com](http://example.com)

```javascript
const Hypercharged = require("../lib/index").default;
// import Hypercharged from "hypercharged";

const hypercharged = new Hypercharged({
    input: {
        url: "http://example.com",
    },
    output: {
        folder: {
            path: __dirname, // means, in directory containing this file
        },
    },
});

hypercharged.addUrl("/");

(async () => {
    await hypercharged.render();
})();
```

Result:

```bash
your-project
├── index.js
├── index.html <-- the generated file
├── package.json
└── package-lock.json
```

### 2. Create the output folder if it does not exist

Hypercharged does not create the output folder if you do not tell it do to so. In this example, we will instruct it to create it if it does not exist.

```javascript
const Hypercharged = require("../lib/index").default;
// import Hypercharged from "hypercharged";

const hypercharged = new Hypercharged({
    input: {
        url: "http://example.com",
    },
    output: {
        folder: {
            path: __dirname + "/prerendered",
            createIfNotExist: true,
        },
    },
});

hypercharged.addUrl("/");

(async () => {
    await hypercharged.render();
})();
```

Result:

```bash
your-project
├── prerendered
│	└── index.html
├── index.js
├── package.json
└── package-lock.json
```

### 3. Generating multiple files

In this example, we will generated multiple pages in a given folder.

```javascript
const Hypercharged = require("../lib/index").default;
// import Hypercharged from "hypercharged";

const hypercharged = new Hypercharged({
    input: {
        url: "http://example.com",
    },
    output: {
        folder: {
            path: __dirname + "/prerenderd",
            createIfNotExist: true,
        },
    },
});

hypercharged.addUrls(["/", "/about", "/contact-us"]);

(async () => {
    await hypercharged.render();
})();
```

Result:

```bash
your-project
├── prerendered
│	├── about
│	│	└── index.html
│	├── contact-us
│	│	└── index.html
│	└── index.html
├── index.js
├── package.json
└── package-lock.json
```

### 4. Using custom puppeteer command before starting to copy the HTML content

If, like me, you are building a single page application, or any other website that relies on Javascript to generate content dynamically, you might be annoyed by the fact that Hypercharged will not wait that your page has finished to execute Javascript before copying the HTML content.

In this example, we will use custom Puppeteer commands to overpass this limitation.

```javascript
const Hypercharged = require("../lib/index").default;
// import Hypercharged from "hypercharged";

const hypercharged = new Hypercharged({
    input: {
        url: "http://example.com",
    },
    output: {
        folder: {
            path: __dirname + "/prerendered",
            createIfNotExist: true,
        },
    },
});

hypercharged.addUrl("/", async function(page) {
    await page.waitForNavigation({
        waitUntil: "networkidle0",
    });
});

(async () => {
    await hypercharged.render();
})();
```

For more information which features you can use with the `page` object, go to [the Puppeteer API](https://github.com/GoogleChrome/puppeteer/blob/v2.0.0/docs/api.md#table-of-contents), then scroll to the Page section.

Result:

```bash
your-project
├── prerendered
│	└── index.html
├── index.js
├── package.json
└── package-lock.json
```

### 5. Passing options before rendering

Hypercharged runs a Chrome instance in headless mode using puppeteer. You can add custom options to pass to this library before it launches a healess driven Chrome instance.

In this example we will tell puppeteer to show the Chrome window while it runs. This is very interesting to troubleshoot issues and understand why something is not going like expected.

```javascript
const Hypercharged = require("../lib/index").default;
// import Hypercharged from "hypercharged";

const hypercharged = new Hypercharged({
    input: {
        url: "http://example.com",
    },
    output: {
        folder: {
            path: __dirname,
        },
    },
});

hypercharged.addUrl("/");

(async () => {
    await hypercharged.render({
        headless: false,
    });
})();
```

You can learn more about which options you can use by reading the [documentation on `puppeteer.launch()` options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions). `puppeteer.launch()` is the method Hypercharged uses to start a Chrome instance to get your pages content.

### 6. Enable the debug mode to print what is Hypercharged doing

In this example, we will activate the debug mode to see in the console what is happening with your urls.

```javascript
const Hypercharged = require("../lib/index").default;
// import Hypercharged from "hypercharged";

const hypercharged = new Hypercharged({
    input: {
        url: "http://example.com",
    },
    output: {
        folder: {
            path: __dirname,
        },
    },
});

hypercharged.addUrls(["/", "/about"]);

(async () => {
    await hypercharged.render();
})();
```

Result in console:

```bash
rendering /...
rendered
rendering /about...
rendered
```

### 7. Use an identical page hold function to a bunch of urls

In this example, we have a lots of urls that needs a same "put the web page on hold" function before copying the content.

```javascript
const Hypercharged = require("../lib/index").default;
// import Hypercharged from "hypercharged";

const hypercharged = new Hypercharged({
    input: {
        url: "http://example.com",
    },
    output: {
        folder: {
            path: __dirname,
        },
    },
});

const callback = async page => {
    await page.waitFor(".card");
};

hypercharged.addUrls(["/", "/about", "/contact-us"], callback);

(async () => {
    await hypercharged.render();
})();
```

You can check the list of all the available method on the puppeteer's `page` object in [the dedicated documentation](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page).
