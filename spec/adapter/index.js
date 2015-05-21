'use strict';

var consolidate = require('../../index');

module.exports = adapter;

function adapter(validatorName, ignores, version) {
    var validator = consolidate(validatorName, { allErrors: true, verbose: true });

    return {
        version: version || 'draft4',
        validate: validator.validate,
        ignores: ignores
    };
}
