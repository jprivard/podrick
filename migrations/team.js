var migrations = [
    {'from': 1, 'to': 2, 'migration': {$set: {sprint_jql: "", schema_version: 2}}},
    {'from': 2, 'to': 3, 'migration': {$set: {rapidview: "", schema_version: 3}}}
];

module.exports = migrations;
