# volto-block-data-figure

[![Releases](https://img.shields.io/github/v/release/eea/volto-block-data-figure)](https://github.com/eea/volto-block-data-figure/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-block-data-figure%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-block-data-figure/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-data-figure-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-data-figure-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-data-figure-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-data-figure-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-data-figure-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-data-figure-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-data-figure-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-data-figure-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-block-data-figure%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-block-data-figure/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-data-figure-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-data-figure-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-data-figure-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-data-figure-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-data-figure-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-data-figure-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-data-figure-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-data-figure-develop)

[Volto](https://github.com/plone/volto) add-on: Data Figure

## Features

![Data Figure](https://github.com/eea/volto-block-data-figure/raw/master/docs/volto-block-data-figure.gif)

## Getting started

### Try volto-block-data-figure with Docker

      git clone https://github.com/eea/volto-block-data-figure.git
      cd volto-block-data-figure
      make
      make start

Go to http://localhost:3000

### Add volto-block-data-figure to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-block-data-figure"
   ],

   "dependencies": {
       "@eeacms/volto-block-data-figure": "*"
   }
   ```

* If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto my-volto-project --canary --addon @eeacms/volto-block-data-figure
   cd my-volto-project
   ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-block-data-figure/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-block-data-figure/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-block-data-figure/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
