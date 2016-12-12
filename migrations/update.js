var Update = function (model, version) {
    this.model = model;
    this.previous_version = version;
};
Update.from = function (model, version) {
    return new Update(model, version);
};
Update.prototype.to = function (version, migration) {
    return this.model.find({schema_version: this.previous_version}).exec(function (err, objects) {
        objects.forEach(function (obj) {
            obj.update(migration).exec(function (err2, res) {
                if (res) {
                    console.log('Object Updated to Version {}'.format(version));
                } else {
                    console.log('Error while trying to update Object to Version {}'.format(version))
                }
            });
        });
    })
};

module.exports = Update;
