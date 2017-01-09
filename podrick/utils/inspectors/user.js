function UserInspector (mock, username) {
    this.mock = mock;
    this.username = username;
    this.expectation = null;
    this.promise = null;
}

Object.defineProperty(UserInspector.prototype, "team", {
    get : function () {
        this.expectation = this.mock.expects('getTeam').once().withArgs(this.username);
        return this;
    }
});

Object.defineProperty(UserInspector.prototype, "instance", {
    get : function () {
        this.expectation = this.mock.expects('get').once().withArgs(this.username);
        return this;
    }
});

UserInspector.prototype.resolves = function (object) {
    this.expectation.returns(Promise.resolve(object));
};

UserInspector.prototype.rejects = function (object) {
    this.expectation.returns(Promise.reject(object));
};

module.exports = UserInspector;
