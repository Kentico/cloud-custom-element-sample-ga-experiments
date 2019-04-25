# Google Analytics experiment selector for Kentico Cloud

This repository contains source code of Google Analytics experiment selector custom element for Kentico Cloud

# Use

If you want to use Google Analytics experiment selector in your project in Kentico Cloud, follow these steps:

* In Kentico Cloud open Content models tab
* Open / create a content model to which you want to add Google Optimize experiment selector
* Add **Custom element** content element
* Open configuration of the content element
* Use following URL as Hosted code URL (HTTPS): https://kentico.github.io/custom-element-samples/GoogleAnalytics/experiment-selector.html
* Provide the following JSON parameters for the custom element to connect it to your Google Analytics, replace the macros with the actual values for your setup

```
{
	"clientId": "<YOUR GOOGLE APP CLIENT ID>.apps.googleusercontent.com",
    "accountId": "<YOUR GOOGLE ANALYTICS ACCOUNT ID>",
    "webPropertyId": "<YOUR GOOGLE ANALYTICS PROPERTY ID>",
    "profileId": "<YOUR GOOGLE ANALYTICS PROFILE ID>"
}
```

# Installation

If you want to adjust the implementation, first download [Kentico Cloud Custom Elements Devkit](https://github.com/kentico/custom-element-devkit). This repository should be positioned within `/client/custom-elements` folder. For further instructions on devkit implementation, please refer to [Custom Element Devkit README](https://github.com/Kentico/custom-element-devkit/blob/master/readme.md).

## Get started

Prerequisites:
* Node.js
* git

```
git clone https://github.com/Kentico/custom-element-devkit.git
cd custom-element-devkit
git clone https://github.com/kenticomartinh/kc-google-analytics.git ./client/custom-elements/kc-google-analytics
npm install --save react react-dom react-select
npm start -- -hw
```

Browse: https://localhost:3000/custom-elements/kc-google-analytics/wrap
