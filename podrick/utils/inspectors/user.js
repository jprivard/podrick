function UserInspector (mock) {
    this.mock = mock;
    this.expectation = null;
    this.promise = null;
}

UserInspector.prototype.getUser = function (user) {
    this.expectation = this.mock.expects('get').once().withArgs(user);
    return this;
};

UserInspector.prototype.getTeamOf = function (user) {
    this.expectation = this.mock.expects('getTeam').once().withArgs(user);
    return this;
};

UserInspector.prototype.resolves = function (object) {
    this.expectation.returns(Promise.resolve(object));
};

UserInspector.prototype.rejects = function () {
    this.expectation.returns(Promise.reject());
};


module.exports = UserInspector;
