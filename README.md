
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

Note 1: You can always refer to [this file](podrick/config/example.json) for an example of the desired file structure.

Note 2: I've find the section called `Slack Real Time Messaging (RTM) API` in [this documentation](https://www.fullstackpython.com/blog/build-first-slack-bot-python.html) to be quite interesting if you don't know how to create a Slack Bot.

#### Run tests
```bash
npm test
```
###Start the bot
```bash
npm start
```
