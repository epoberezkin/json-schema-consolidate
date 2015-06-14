'use strict';

var consolidate = require('../index')
  , assert = require('assert')
  , META_SCHEMA = require('./meta_schema.json');

var VALIDATOR = process.env.JSC_VALIDATOR;

// Not/partially supported features
// uris can be both full and short if not specified, short uris are used in the test in this case
var VALIDATORS = {
  'ajv':              { },
  'is-my-json-valid': {                                      uri: 'short', allErrors: false },
  'jayschema':        {                                                    allErrors: false },
  'jjv':              {                                                    allErrors: false },
  'jsck':             {                    addSchema: true,  uri: 'full#', allErrors: false, customFormats: false },
  'jsen':             {                    addSchema: false,               allErrors: false },
  'jsonschema':       { metaSchema: false,                   uri: 'full',                    customFormats: false },
  'schemasaurus':     { metaSchema: false, addSchema: false,               allErrors: false, customFormats: RegExp },
  'skeemas':          {                                      uri: 'full',  allErrors: false, customFormats: false },
  'themis':           {                                                    allErrors: false },
  'tv4':              { metaSchema: false },
  'z-schema':         { }
};

var validators = VALIDATOR ? [VALIDATOR] : Object.keys(VALIDATORS);


validators.forEach(describeConsolidate);


function describeConsolidate(validatorName) {
  describe(validatorName, function() {
    var SCHEMA, VALID, INVALID;
    var Validator;

    before(function() {
      Validator = consolidate(validatorName);
      createTestSchemas(VALIDATORS[validatorName].uri);
    });

    it('should create Validator instance', function() {
      var validator = consolidate(validatorName, {});
      assert(validator instanceof Validator);
    });

    describe('validator instance', function() {
      var validator;

      beforeEach(function() {
        validator = new Validator;
      });

      (skip('metaSchema') ? it.skip : it)
      ('should validate valid schema against metaschema', function() {
        assertValid(validator.validate(META_SCHEMA, VALID[0]));
      });

      (skip('metaSchema') ? it.skip : it)
      ('should correctly validate INVALID schema against metaschema', function() {
        assertInvalid(validator.validate(META_SCHEMA, INVALID[0]));
      });

      it('should validate json against schema', function() {
        assertValid(validator.validate(SCHEMA[1], VALID[1]));
        assertInvalid(validator.validate(SCHEMA[1], INVALID[1]));
      });

      it('should validate json against stringified schema', function() {
        var schema = JSON.stringify(SCHEMA[1]);
        assertValid(validator.validate(schema, VALID[1]));
        assertInvalid(validator.validate(schema, INVALID[1]));
      });

      it('should "compile" validator for schema', function() {
        var validate = validator.compile(SCHEMA[1]);
        assertValid(validate(VALID[1]));
        assertInvalid(validate(INVALID[1]));
      });

      it('should "compile" validator for stringified schema', function() {
        var validate = validator.compile(JSON.stringify(SCHEMA[1]));
        assertValid(validate(VALID[1]));
        assertInvalid(validate(INVALID[1]));
      });

      (skip('addSchema') ? it.skip : it)
      ('should add schema with "addSchema"', function() {
        validator.addSchema(SCHEMA[1]);
        assertGetSchema();
        assertValid(validator.validate(SCHEMA[2], VALID[2]));
        assertInvalid(validator.validate(SCHEMA[2], INVALID[2]));
      });

      (skip('addSchema') ? it.skip : it)
      ('should add stringified schema with "addSchema"', function() {
        validator.addSchema(JSON.stringify(SCHEMA[1]));
        assertGetSchema();
        assertValid(validator.validate(SCHEMA[2], VALID[2]));
        assertInvalid(validator.validate(SCHEMA[2], INVALID[2]));
      });

      (skip('addSchema') ? it.skip : it)
      ('should add schema via options', function() {
        var schemas = {};
        schemas[SCHEMA[1].id] = SCHEMA[1];
        validator = new Validator({schemas: schemas});
        assertGetSchema();
        assertValid(validator.validate(SCHEMA[2], VALID[2]));
        assertInvalid(validator.validate(SCHEMA[2], INVALID[2]));
      });

      (skip('addSchema') ? it.skip : it)
      ('should add stringified schema via options', function() {
        var schemas = {};
        schemas[SCHEMA[1].id] = JSON.stringify(SCHEMA[1]);
        validator = new Validator({schemas: schemas});
        assertGetSchema();
        assertValid(validator.validate(SCHEMA[2], VALID[2]));
        assertInvalid(validator.validate(SCHEMA[2], INVALID[2]));
      });

      (skip('customFormats') ? it.skip : it)
      ('should support custom regexp format via options', function() {
        validator = new Validator({formats: {my_identifier: /^[a-z][a-z0-9_]*$/i}});
        assertValid(validator.validate(SCHEMA[3], VALID[3]));
        assertInvalid(validator.validate(SCHEMA[3], INVALID[3]));
      });

      (skip('customFormats', RegExp) ? it.skip : it)
      ('should support custom function format via options', function() {
        validator = new Validator({formats: {palindrome: palindrome}});
        assertValid(validator.validate(SCHEMA[4], VALID[4]));
        assertInvalid(validator.validate(SCHEMA[4], INVALID[4]));

        function palindrome(str) {
          return !str || str == str.split('').reverse().join('');
        }
      });

      (skip('allErrors') ? it.skip : it)
      ('should support allErrors option', function() {
        var validatorAll = new Validator({allErrors: true});
        assertValid(validator.validate(SCHEMA[5], VALID[5]));
        assertValid(validatorAll.validate(SCHEMA[5], VALID[5]));
        var result = validator.validate(SCHEMA[5], INVALID[5]);
        var resultAll = validatorAll.validate(SCHEMA[5], INVALID[5]);
        assert.equal(result.valid, false);
        assert.equal(resultAll.valid, false);
        // console.log('*   one', result.errors);
        // console.log('*** all', resultAll.errors);
        assert(resultAll.errors.length > result.errors.length);
      });

      if (validatorName == 'tv4') {
        it('should support banUnknownProperties option', function() {
          var validatorNA = new Validator({banUnknownProperties: true});
          assertValid(validator.validate(SCHEMA[6], VALID[6]));
          assertValid(validatorNA.validate(SCHEMA[6], VALID[6]));
          assertValid(validator.validate(SCHEMA[6], INVALID[6]));
          assertInvalid(validatorNA.validate(SCHEMA[6], INVALID[6]));
        });
      }

      function assertValid(result) {
        // console.log(result);
        assert(result.valid)
        assert.deepEqual(result.errors, []);
      }

      function assertInvalid(result) {
        // console.log(result);
        assert.equal(result.valid, false);
        assert(Object.keys(result.errors).length >= 1);
      }

      function assertGetSchema() {
        assert.deepEqual(validator.getSchema(SCHEMA[1].id), SCHEMA[1]);
      }

      function skip(feature, value) {
        var _feature = VALIDATORS[validatorName][feature];
        return _feature === false || (value && _feature == value);
      }
    });


    function createTestSchemas(uri) {
      SCHEMA = []; VALID = []; INVALID = [];

      var uriHost = uri && uri.indexOf('full') >= 0 ? 'http://example.com/' : '';
      var uriHash = uri && uri.indexOf('#') >= 0 ? '#' : '';

      VALID[0] = {
        id: 'http://example.com/schema0a' + uriHash,
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: {
          s: { type: 'string' },
          n: { type: 'number' }
        }
      };

      INVALID[0] = {
        id: 'http://example.com/schema0b' + uriHash,
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: [
          { s: 'string' },
          { n: 'number' }
        ]
      };


      SCHEMA[1] = {
        id: uriHost + 'schema1' + uriHash,
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: {
          s: { type: 'string' },
          n: { type: 'number' }
        },
        required: ['s']
      };

      VALID[1] = { s: 'test', n: 1 };
      INVALID[1] = { s: 1, n: 'test' };


      SCHEMA[2] = {
        id: uriHost + 'schema2' + uriHash,
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'array',
        items: {'$ref': uriHost + 'schema1' + uriHash},
        additionalItems: false
      };

      VALID[2] = [{s: 'test'}];
      INVALID[2] = [{n: 1}, {s: 'test', n: 2}];


      SCHEMA[3] = {
        id: uriHost + 'schema3' + uriHash,
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: {
          x: { type: 'string', format: 'my_identifier' },
        },
        required: ['x']
      };

      VALID[3] = { x: 'Xyz1' };
      INVALID[3] = { x: '1xyz' };


      SCHEMA[4] = {
        id: uriHost + 'schema3' + uriHash,
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: {
          x: { type: 'string', format: 'palindrome' },
        },
        required: ['x']
      };

      VALID[4] = { x: 'abba' };
      INVALID[4] = { x: 'abbac' };


      SCHEMA[5] = {
        id: uriHost + 'schema4' + uriHash,
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: {
          obj: {
            type: 'object',
            properties: {
              s: { type: 'string', pattern: '^valid$' },
              n: { type: 'number' }
            },
            required: ['s']
          },
          n: { type: 'number' }
        },
        required: ['obj']
      };

      VALID[5] = { obj: { s: 'valid', n: 1 }, n: 2 };
      INVALID[5] = { obj: { s: 'invalid', n: 'invalid1' }, n: 'invalid2' };


      SCHEMA[6] = {
        id: uriHost + 'schema4' + uriHash,
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: {
          s: { type: 'string' }
        }
      };

      VALID[6] = { s: 'test' };
      INVALID[6] = { s: 'test', additional: 'invalid' };
    }
  });
}
