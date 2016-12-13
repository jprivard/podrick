# Podrick
This application is a SlackBot helping a Scrum Team.

### Available Modules
#### Help
Automatically bundled with the application, HELP will provide information on which modules are installed and how to use them.

#### Team
Podrick will help you to setup your teams, making sure you don't start spamming everyone for specific team activities.

#### Poker Planning
You don't have the physical cards with you? No problem. Just let Podrick know you wish to setup a Poker Game for your team and he's going to ask each member for their input.

### Prerequisite
* NPM
* a MongoDB running

### How to use
#### Installation
```bash
npm install
```
Then, it is recommended to create a configuration file `podrick/config/production.json` containing these details :
* The address of the mongoDB
* the Slack's Token ID of your bot

Note 1: You can always refer to [this file](config/example.json) for an example of the desired file structure.

Note 2: I've find the section called `Slack Real Time Messaging (RTM) API` in [this documentation](https://www.fullstackpython.com/blog/build-first-slack-bot-python.html) to be quite interesting if you don't know how to create a Slack Bot.

#### Update
```bash
npm run migrations
```
If you recently updated the files of this project, it is possible the objects in your collections need to be updated to reflect the new schema.

By running the aforementioned command, it will make sure every objects in your collections fits the newest schema version.
#### Run tests
```bash
npm test
```

#### Start the bot
```bash
npm start
```
When the script is running, you can always request Podrick to give you information on how to discuss with him.

##### Help
`@podrick Help` in a channel or simply `help` in a direct message will list all the registered modules.

##### How to
`@podrick How to use "{Module Name}"` in a channel or simply `How to use "{Module Name}` in a direct message will give you all the registered functions for the specified module.
