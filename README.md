# volto-block-data-figure
[![Releases](https://img.shields.io/github/v/release/eea/volto-block-data-figure)](https://github.com/eea/volto-block-data-figure/releases)

[Volto](https://github.com/plone/volto) add-on

## Features

###

Demo GIF

## Getting started

1. Create new volto project if you don't already have one:
    ```
    $ npm install -g @plone/create-volto-app
    $ create-volto-app my-volto-project
    $ cd my-volto-project
    ```

1. Update `package.json`:
    ``` JSON
    "addons": [
        "@eeacms/volto-block-data-figure"
    ],

    "dependencies": {
        "@eeacms/volto-block-data-figure": "github:eea/volto-block-data-figure#0.1.0"
    }
    ```

1. Install new add-ons and restart Volto:
    ```
    $ yarn
    $ yarn start
    ```

1. Go to http://localhost:3000

1. Happy editing!

## How to contribute

See [DEVELOP.md](DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
