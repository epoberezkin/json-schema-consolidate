'use strict';

module.exports = consolidate;

function consolidate(validator, otps) {
    var Validator = require('./validators/' + validator);
    return otps ? new Validator(otps) : Validator;
}
