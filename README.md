[![Build Status](https://travis-ci.org/urbanriskmap/riskmap-ng.svg?branch=dev)](https://travis-ci.org/urbanriskmap/riskmap-ng)
[![DOI](https://zenodo.org/badge/116730055.svg)](https://zenodo.org/badge/latestdoi/116730055)
[![Coverage Status](https://coveralls.io/repos/github/urbanriskmap/cognicity-server/badge.svg?branch=master)](https://coveralls.io/github/urbanriskmap/cognicity-server?branch=master)

## DEPRECATED

# Riskmap
UrbanRiskMap web app [Angular](https://github.com/angular/angular-cli) project using [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/). UrbanRiskMap reports flooding in real-time

## Development server

### Machine setup
1. Install NodeJS >= 4.x
    * You can [download it here](https://nodejs.org/en/).
2. Install NPM 5.7.x
    * Even though you may have the latest NodeJS, that doesn't mean you have the latest version of NPM. You can check your version with `npm -v`. If you need to update, run `npm install npm -g`.
3. Install Angular CLI
    * `npm install -g @angular/cli`

### Application setup
* Install the project dependencies
    * `npm install`

### Start development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

For configuring dev server to serve a specific deployment, say PetaBencana.id (deployment key: id):
1. Set `dep=id` in package.json > scripts.start
2. Replace src/environments/environment.ts with src/environments/id/environment.ts

___

## Deployments & Instances

Deployments are projects deployed in a macro-region / country with one or more supported instance regions (cities / counties). Each deployment shall be supported by a separate data server and data base, with map layers and content across instances of a deployment sharing the same properties and structure.

Currently supported deployments with their instances include:
1. PetaBencana.id
    * Jakarta
    * Bandung
    * Surabaya
    * Semarang
2. Riskmap.in
    * Chennai
3. Riskmap.us
    * Broward

The app comprises of a common source code and a few shared assets across these deployments. However, majority of assets and resources are dependent on the deployment. These are picked from the deployments/ folder using the specified deployment key (id | in | us) and placed in the src/ folder before the build process. Ref. tasks/fetch-assets

___

## Project structure

The project structure is as follows:
- **deployments**: Deployment specific assets and resources are located here, in directories named with the deployment key.
- **src**
  * **app**
  * **assets**
    * **fonts**: Webfont icons, app typography resources
    * ***icons*** [DS]: Browser tab icons (favicons), Phone app icons
    * ***images*** [DS]: Images, graphics used in app
    * ***locales*** [DS]: Locale files for supported languages
    * ***logos*** [DS]: Project author, partner's, supporter's logos
  * **environments**: Environment files are located here, in directories named with the deployment key. Use default angular naming convention, eg.:
    * dev: environment.ts
    * prod: environment.prod.ts
    * stage: environment.stage.ts
  * ***resources*** [DS]: Contains app, map content that changes with deployments, but remains the same across environments and instances.
  * **styles**: Contains global [SASS](https://sass-lang.com/) (.scss) style sheets and [Angular Material](https://material.angular.io/) configurations.
  * *index.html* [DS]: App landing page. Each deployment requires a separate index file for configuring various `<meta>` tags.
- **tasks**: Pre-build tasks are located here.
- .angular-cli.json: Config file for angular project. When adding a new deployment, insert a directory map for the deployment's environment files here.

NOTE: Folders marked as Deployment Specific [DS] are generated ahead of build scripts. Changes made in the src/ folder will not be tracked and will be overwritten with content from files located in /deployments folder.

___

## Steps to add a new deployment

1. Choose a two-letter key for deployment, say `xy`
2. Create a directory `xy` under src/environments/
  * Copy dev environment (environment.ts) from any existing deployment, and configure values
  * Open .angular-cli.json, add following keys to environments:
    * `"dev-xy": "environments/xy/environment.ts"`
3. Create a directory `xy` under deployments/
  * Copy contents from any existing deployment, modify accordingly
    * **assets/icons**: Use [this](https://realfavicongenerator.net/) web service to generate web, app icons
    * **assets/locales**: Must contain a locale file for each language specified in environment > locales > supported languages. Refer to language codes [here](https://momentjs.com/)
    * **assets/logos**: Must contain app_logo.svg; rest as required
    * **resources/info-content**: Content for the 'Info' tab
    * **resources/instances**: Add instance regions along with bounding boxes, and instance codes as used in Back-end config
    * **resources/layers**: Add configuration values for all layers supported in the deployment. Refer Mapbox layer style specs [here](https://www.mapbox.com/mapbox-gl-js/style-spec/#layers)
    * **resources/moment-locales**: Export moment locale from node module for languages other than English
    * **resources/report-content**: Content for the 'How to report' tab
    * **index.html**: Modify `<meta>` tags as required
4. Refer Development server > Start development server steps as listed above, to run app locally.
5. Add build scripts in package.json:
  * Add `"build-dev-xy"` and `"build-prod-xy"` keys with respective scripts
  * Include `"npm run build-dev-xy"` in `"build-dev"` script
6. Configure .travis.yml to deploy bundle from dist/dev-xy

___

## Progressive Web App testing

Install [Chrome lighthouse extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=en).
Run `npm run serve-prod-ngsw` to locally serve an app over node http-server.
Navigate to `http://localhost:8080/broward`, press lighthouse icon, then 'Generate report'.

Run `npm run build` to generate files for deployment.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
