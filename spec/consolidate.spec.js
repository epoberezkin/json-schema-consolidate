'use strict';


var consolidate = require('../index')
    , jsonSchemaTests = require('json-schema-tests');


var VALIDATORS = [
    'is-my-json-valid'
];


VALIDATORS.forEach(function(validatorName) {
    var validator = consolidate(validatorName, { allErrors: true, verbose: true });
    jsonSchemaTests({ version: 'draft4', validate: validator.validate });
});
