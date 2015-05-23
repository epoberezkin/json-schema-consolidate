'use strict';

var consolidate = require('../index')
  , assert = require('assert');

var VALIDATOR = process.env.JSC_VALIDATOR;
var validators = VALIDATOR ? [VALIDATOR] : [
  "is-my-json-valid",
  "jjv",
  "tv4"
];

var SCHEMA1, VALID1, INVALID1, SCHEMA2, VALID2, INVALID2, SCHEMA3, VALID3, INVALID3;
createTestSchemas();


validators.forEach(describeConsolidate);


function describeConsolidate(validatorName) {
  describe('consolidate with ' + validatorName, function() {
    var Validator;

    before(function() {
      Validator = consolidate(validatorName);
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

      it('should validate json against schema', function() {
        assertValid(validator.validate(SCHEMA1, VALID1));
        assertInvalid(validator.validate(SCHEMA1, INVALID1));
      });

      it('should validate json against stringified schema', function() {
        var schema = JSON.stringify(SCHEMA1);
        assertValid(validator.validate(schema, VALID1));
        assertInvalid(validator.validate(schema, INVALID1));
      });

      it('should "compile" validator for schema', function() {
        var validate = validator.compile(SCHEMA1);
        assertValid(validate(VALID1));
        assertInvalid(validate(INVALID1));
      });

      it('should "compile" validator for stringified schema', function() {
        var validate = validator.compile(JSON.stringify(SCHEMA1));
        assertValid(validate(VALID1));
        assertInvalid(validate(INVALID1));
      });

      it('should add schema with "addSchema"', function() {
        validator.addSchema(SCHEMA1);
        assertGetSchema();
        assertValid(validator.validate(SCHEMA2, VALID2));
        assertInvalid(validator.validate(SCHEMA2, INVALID2));
      });

      it('should add stringified schema with "addSchema"', function() {
        validator.addSchema(JSON.stringify(SCHEMA1));
        assertGetSchema();
        assertValid(validator.validate(SCHEMA2, VALID2));
        assertInvalid(validator.validate(SCHEMA2, INVALID2));
      });

      it('should add schema via options', function() {
        validator = new Validator({schemas: {schema1: SCHEMA1}});
        assertGetSchema();
        assertValid(validator.validate(SCHEMA2, VALID2));
        assertInvalid(validator.validate(SCHEMA2, INVALID2));
      });

      it('should add stringified schema via options', function() {
        validator = new Validator({schemas: {schema1: JSON.stringify(SCHEMA1)}});
        assertGetSchema();
        assertValid(validator.validate(SCHEMA2, VALID2));
        assertInvalid(validator.validate(SCHEMA2, INVALID2));
      });

      it('should add custom regexp format via options', function() {
        validator = new Validator({formats: {my_identifier: /^[a-z][a-z0-9_]*$/i}});
        assertValid(validator.validate(SCHEMA3, VALID3));
        assertInvalid(validator.validate(SCHEMA3, INVALID3));
      });

      function assertValid(result) {
        assert.deepEqual(result, { valid: true, errors: [] });
      }

      function assertInvalid(result) {
        assert.equal(result.valid, false);
        assert(Object.keys(result.errors).length >= 1);
      }

      function assertGetSchema() {
        assert.deepEqual(validator.getSchema(SCHEMA1.id), SCHEMA1);
      }
    });
  });
}


function createTestSchemas() {
  SCHEMA1 = {
    id: 'schema1',
    type: 'object',
    properties: {
      s: { type: 'string' },
      n: { type: 'number' }
    },
    required: ['s']
  };


  VALID1 = { s: 'test', n: 1 };
  INVALID1 = { s: 1, n: 'test' };

  SCHEMA2 = {
    id: 'schema2',
    type: 'array',
    items: {'$ref': 'schema1'},
    additionalItems: false
  };

  VALID2 = [{s: 'test'}];
  INVALID2 = [{n: 1}, {s: 'test', n: 2}];


  SCHEMA3 = {
    id: 'schema1',
    type: 'object',
    properties: {
      x: { type: 'string', format: 'my_identifier' },
    },
    required: ['x']
  };

  VALID3 = { x: 'Xyz1' };
  INVALID3 = { x: '1xyz' };
}
