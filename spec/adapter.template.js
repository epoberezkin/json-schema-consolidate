'use strict';

var consolidate = require('../index');
// test script replaces ${VALIDATOR} below with validator names
var validatorName = '${VALIDATOR}';
var remoteRefs = {
    'http://localhost:1234/integer.json': require('json-schema-tests/JSON-Schema-Test-Suite/remotes/integer.json'),
    'http://localhost:1234/subSchemas.json': require('json-schema-tests/JSON-Schema-Test-Suite/remotes/subSchemas.json'),
    'http://localhost:1234/folder/folderInteger.json': require('json-schema-tests/JSON-Schema-Test-Suite/remotes/folder/folderInteger.json'),
    'http://json-schema.org/draft-04/schema': require('./meta_schema.json')
};

var NO_REMOTES = ['themis', 'jsck'];
var NO_META = ['ajv'];

if (NO_REMOTES.indexOf(validatorName) == -1) var schemas = remoteRefs;
if (NO_META.indexOf(validatorName) >= 0) delete schemas['http://json-schema.org/draft-04/schema'];
var validator = consolidate(validatorName, { allErrors: true, schemas: schemas });

module.exports = {
    version: 'draft4',
    validate: validator.validate,
    ignores: ignoredTests()
};


function ignoredTests() {
    return {
        'ajv': {
            'optional/zeroTerminatedFloats': true
        },
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
            refRemote: ['change resolution scope']
        },
        'jjv': {
            maxLength: true,
            minLength: true,
            'optional/zeroTerminatedFloats': true,
            refRemote: ['change resolution scope']
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
            maxLength: true,
            minLength: true,
            'optional/zeroTerminatedFloats': true
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
            'optional/zeroTerminatedFloats': true
        },
        'themis': {
            definitions: true,
            'optional/zeroTerminatedFloats': true,
            ref: ['remote ref, containing refs itself'],
            refRemote: true
        },
        'tv4': {
            enum: ['heterogeneous enum validation'],
            maxLength: true,
            minLength: true,
            'optional/format': true,
            'optional/zeroTerminatedFloats': true,
            uniqueItems: true
        },
        'z-schema': {
            'optional/format': ['validation of URIs'],
            'optional/zeroTerminatedFloats': true,
            refRemote: true
        }
    }[validatorName];
}
