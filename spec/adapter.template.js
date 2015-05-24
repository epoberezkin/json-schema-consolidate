'use strict';

var consolidate = require('../index');
// test script replaces ${VALIDATOR} below with validator names
var validatorName = '${VALIDATOR}';
var validator = consolidate(validatorName, { allErrors: true });

module.exports = {
    version: 'draft4',
    validate: validator.validate,
    ignores: ignoredTests()
};


function ignoredTests() {
    return {
        'is-my-json-valid': {
            definitions: ['invalid definition'],
            maxLength: true,
            minLength: true,
            'optional/zeroTerminatedFloats': true,
            ref: ['remote ref, containing refs itself'],
            refRemote: true
        },
        'jayschema': {
            maxLength: true,
            minLength: true,
            'optional/format': ['validation of URIs'],
            'optional/zeroTerminatedFloats': true,
            refRemote: true
        },
        'jjv': {
            definitions: ['valid definition'],
            maxLength: true,
            minLength: true,
            'optional/zeroTerminatedFloats': true,
            ref: ['remote ref, containing refs itself'],
            refRemote: true
        },
        'jsck': {
            definitions: true,
            maxLength: true,
            minLength: true,
            'optional/zeroTerminatedFloats': true,
            ref: ['remote ref, containing refs itself'],
            refRemote: true,
            uniqueItems: true
        },
        'jsen': {
            maxLength: true,
            minLength: true,
            'optional/zeroTerminatedFloats': true,
            refRemote: true
        },
        'jsonschema': {
            definitions: ['valid definition'],
            maxLength: true,
            minLength: true,
            'optional/zeroTerminatedFloats': true,
            ref: ['remote ref, containing refs itself'],
            refRemote: true
        },
        'schemasaurus': {
            definitions: true,
            maxLength: true,
            minLength: true,
            'optional/zeroTerminatedFloats': true,
            ref: ['remote ref, containing refs itself'],
            refRemote: true
        },
        'skeemas': {
            definitions: true,
            'optional/zeroTerminatedFloats': true,
            ref: ['remote ref, containing refs itself'],
            refRemote: true
        },
        'themis': {
            definitions: true,
            'optional/zeroTerminatedFloats': true,
            ref: ['remote ref, containing refs itself'],
            refRemote: true
        },
        'tv4': {
            definitions: ['valid definition'],
            enum: ['heterogeneous enum validation'],
            maxLength: true,
            minLength: true,
            'optional/format': true,
            'optional/zeroTerminatedFloats': true,
            ref: ['remote ref, containing refs itself'],            
            refRemote: true,
            uniqueItems: true
        },
        'z-schema': {
            'optional/format': ['validation of URIs'],
            'optional/zeroTerminatedFloats': true,
            refRemote: true
        }
    }[validatorName];
}
