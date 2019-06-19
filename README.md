# Google Analytics Experiment selector for Kentico Cloud

[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-cloud)

This repository contains source code of Bynder image selector custom element for Kentico Cloud

# Use

If you want to use Google Analytics Experiment selector in your project in Kentico Cloud, follow these steps:

* In Kentico Cloud open Content models tab
* Open / create a content model to which you want to add Google Optimize Experiment selector
* Add **Custom element** content element
* Open configuration of the content element
* Use following URL as Hosted code URL (HTTPS): https://kentico.github.io/custom-element-samples/GoogleAnalyticsExperiments/experiment-selector.html
* Provide the following JSON parameters for the custom element to connect it to your Google Analytics, replace the macros with the actual values for your setup

```
{
  "clientId": "<YOUR GOOGLE APP CLIENT ID>.apps.googleusercontent.com",
  "accountId": "<YOUR GOOGLE ANALYTICS ACCOUNT ID>",
  "webPropertyId": "<YOUR GOOGLE ANALYTICS PROPERTY ID>",
  "profileId": "<YOUR GOOGLE ANALYTICS PROFILE ID>"
}
```

## Example output

The element will save a value containing the experiment/variant identifier as well as metadata need for first display of the selector.

```json
[
  "YI5uxeAkRZ-0E1-7oQ5FXg/2",
  {
    "experiment": {
      "id": "YI5uxeAkRZ-0E1-7oQ5FXg",
      "key": "190562962-3",
      "name": "Home page A/B test"
    },
    "variant": {
      "id": "2",
      "name": "Try Premium"
    }
  }
]
```

The experiment/variant identifier is at the beginning of the value so that the content items can be filtered based on the prefix of the value.

# Installation

If you want to adjust the implementation, first download [Kentico Cloud Custom Elements Devkit](https://github.com/kentico/custom-element-devkit). This repository should be positioned within `/client/custom-elements` folder. For further instructions on devkit implementation, please refer to [Custom Element Devkit README](https://github.com/Kentico/custom-element-devkit/blob/master/readme.md).

## Get started

Prerequisites:
* Node.js
* git

```
git clone https://github.com/Kentico/custom-element-devkit.git
cd custom-element-devkit
git clone https://github.com/Kentico/cloud-custom-element-sample-ga-experiments.git ./client/custom-elements/cloud-custom-element-sample-ga-experiments
npm install --save react@^16.8.6 react-dom@^16.8.6 react-select@^2.4.3
npm start -- -hw
```
Browse: https://localhost:3000/custom-elements/cloud-custom-element-sample-ga-experiments/wrap

# Live site implementation sample

If you want to see live site example of AB Testing used on the live site, browse to a [deployed sample site](https://kentico-cloud-sample-app-react-ga-experiments.surge.sh).

See source code of the sample site implementation [here](https://github.com/Kentico/cloud-sample-app-react/commit/67d48c6f3953f95a50eb5d28cf4c27d8432635f4).

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/cloud-custom-element-sample-ga-experiments?pixel)
