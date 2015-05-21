'use strict';

module.exports = consolidate;

function consolidate(validator) {
    return require('./validators/' + validator);
}
