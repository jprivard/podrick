var Help = require('./modules/help/module');

function Application(config, bot, mongoose) {
    this.controller = undefined;
    this.modules = {};
    this.config = config;
    this.bot = bot;
    mongoose.connect(this.config.mongo);
}

Application.prototype.start = function() {
    this.addModule(Help.name, Help.getInstance(this.modules));
    this.bot.start();
};

Application.prototype.addModule = function (name, module) {
    module.registerListeners(this.bot);
    this.modules[name] = module;
};

module.exports = Application;
