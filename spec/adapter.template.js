'use strict';

var consolidate = require('../index');
var validator = consolidate('${VALIDATOR}', { allErrors: true, verbose: true });
// test script replaces ${VALIDATOR} above with validator names

module.exports = {
    version: 'draft4',
    validate: validator.validate,
    ignores: {}
};
