# Bushtabs

Bushtabs is a non for profit business idea aimed to raise funds for struggling Australian communities. Motivated by the 2020 Australian bushfires, the service transforms your browser tabs to a beautiful Australian background with the date and time. Additionally, small advertisements are used and displayed to the user to generate funds. Creating more tabs raises funds. 



## Services and technologies

- `NodeJS` 10.15 and above
- `Firefox / Chrome Browser` - for running the extension
- `MongoDB` - For storing the history of photos used on the service
- `Slack` - Logging service for new photos, force updating the photo, and debugging
- `AWS S3` - Storage for the photo
- `AWS EC2` - The brains of the entire
- `Docker` - Used to containerise the server side app

## APIs

- `Unsplash API` - Used for fetching a background picture 
- `Slack API `- Used to logging (when background photo is updated)

## Prerequisites

An environment variables file must be included in the /server folder. This repository contains an example file called `.env-example` and can be renamed to `.env` for the program to recognise the variables. The file should include:

- the db credentials
- unsplash api credentials
- AWS IAM credentials
- AWS S3 bucket
- Slack api credentials (optional)



## Deployment

### Server-Side

1. Run `npm install`
2. Run `npm run start`

### Extension

The /extension folder is ready to be installed on [firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension) or [chrome](https://support.google.com/chromebook/answer/2588006?hl=en).



## Problems

Despite completing the basic features, I also encountered a problem publishing to the browser stores as my extension breach security policy for injecting scripts from a 3rd party service. More time and research must be put into this issue. 