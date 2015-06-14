'use strict';

module.exports = consolidate;

function consolidate(validator, opts) {
    var Validator = require('./validators/' + validator);
    return opts ? new Validator(opts) : Validator;
}
