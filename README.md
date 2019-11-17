![](https://user-images.githubusercontent.com/15908747/69000199-29736380-08cc-11ea-8a69-b375da50f7da.png)

Generates a prerendered site from your original website.

[![npm](https://img.shields.io/npm/v/hypercharged)](https://www.npmjs.com/package/hypercharged) [![npm (prod) dependency version](https://img.shields.io/npm/dependency-version/hypercharged/puppeteer)](https://www.npmjs.com/package/puppeteer) [![Build Status](https://travis-ci.com/khalyomede/hypercharged.svg?branch=master)](https://travis-ci.com/khalyomede/hypercharged) [![codecov](https://codecov.io/gh/khalyomede/hypercharged/branch/master/graph/badge.svg)](https://codecov.io/gh/khalyomede/hypercharged) [![Stryker mutation score](https://badge.stryker-mutator.io/github.com/khalyomede/hypercharged/master)](https://badge.stryker-mutator.io/github.com/khalyomede/hypercharged/master) [![Maintainability](https://api.codeclimate.com/v1/badges/fdd6b022afedcefeeefe/maintainability)](https://codeclimate.com/github/khalyomede/hypercharged/maintainability)
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

With npm:

```bash
npm install --save-dev hypercharged
```

Or with Yarn:

```bash
yarn add --dev hypercharged
```

## Usage

-   [1. Simple usage](#1-simple-usage)
-   [2. Create the output folder if it does not exist](#2-create-the-output-folder-if-it-does-not-exist)
-   [3. Generating multiple files](#3-generating-multiple-files)
-   [4. Using custom puppeteer command before starting to copy the HTML content](#4-using-custom-puppeteer-command-before-starting-to-copy-the-html-content)

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

hypercharged.enableDebug();
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

hypercharged.enableDebug();
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

hypercharged.enableDebug();
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

hypercharged.enableDebug();
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
