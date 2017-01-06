function ConversationInspector (mock) {
    this.expectation = mock.expects('startConversationWith').once();
}

ConversationInspector.prototype.with = function (user) {
    this.expectation.withArgs(user);
    return this;
};

ConversationInspector.prototype.and = function () {
    return this;
};

ConversationInspector.prototype.say = function (conversation) {
    this.expectation.callsArgWith(1, {}, conversation);
    return this;
};

module.exports = ConversationInspector;
