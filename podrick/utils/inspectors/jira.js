function JiraInspector (mock) {
    this.mock = mock;
    this.expectation = null;
}

Object.defineProperty(JiraInspector.prototype, "dailySummary", {
    get : function () {
        this.expectation = this.mock.expects('getSummarySinceLastDaily');
        return this;
    }
});

Object.defineProperty(JiraInspector.prototype, "of", {
    get : function () { return this; }
});

JiraInspector.prototype.rapidBoard = function (id) {
    this.expectation.withArgs(id);
    return this;
};

JiraInspector.prototype.resolves = function (object) {
    this.expectation.returns(Promise.resolve(object));
};

JiraInspector.prototype.rejects = function (object) {
    this.expectation.returns(Promise.reject(object));
};

module.exports = JiraInspector;
