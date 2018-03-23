[![Build Status](https://travis-ci.org/urbanriskmap/riskmap-ng.svg?branch=dev)](https://travis-ci.org/urbanriskmap/riskmap-ng)

# Riskmap
CogniCity web app angular project using mapbox gl
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.0.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deployments & Instances

Deployments are projects deployed in a macro-region / country with one or more supported instance regions (cities / counties). Each deployment shall be supported by a separate data server and data base, with map layers and content across instances of a deployment sharing the same properties and structure.

Currently supported deployments with their instances include:
* PetaBencana.id
  * Jakarta
  * Bandung
  * Surabaya
  * Semarang
* Riskmap.in
  * Chennai
* Riskmap.us
  * Broward

The app comprises of a common source code and a few shared assets across these deployments. However, majority of assets and resources are dependent on the deployment. These are picked from the deployments/ folder using the specified deployment key (id | in | us) and placed in the src/ folder before the build process. Ref. tasks/fetch-assets

## Progressive Web App testing

Install [Chrome lighthouse extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=en).
Run `npm run serve-prod-ngsw` to locally serve an app over node http-server.
Navigate to `http://localhost:8080/broward`, press lighthouse icon, then 'Generate report'.

Run `npm run build` to generate files for deployment.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
