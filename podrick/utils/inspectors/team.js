function TeamInspector (mock, name) {
    this.mock = mock;
    this.name = name;
    this.expectation = null;
}

Object.defineProperty(TeamInspector.prototype, "instance", {
    get : function () {
        this.expectation = this.mock.expects('get').once().withArgs(this.name);
        return this;
    }
});

TeamInspector.prototype.resolves = function (object) {
    this.expectation.returns(Promise.resolve(object));
};

TeamInspector.prototype.rejects = function (object) {
    this.expectation.returns(Promise.reject(object));
};

module.exports = TeamInspector;
