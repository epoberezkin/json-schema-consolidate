'use strict';


var tv4 = require('tv4')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this.tv4 = tv4.freshApi();
    this._opts = util.copy(opts);
    var _schemas = this._opts.schemas = this._opts.schemas || {};
    var _formats = this._opts.formats || {};

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas) addSchema(_schemas[id], id);
    for (var f in _formats) this.tv4.addFormat(f, _regexp(f, _formats[f]));


    function validate(schema, json) {
        return _result(self.tv4[_method()](json, util.parse(schema)));
    }


    function compile(schema) {
        schema = util.parse(schema);

        return function validate(json) {
            return _result(self.tv4[_method()](json, schema));
        };
    }


    function _method() {
        return self._opts.allErrors ? 'validateMultiple' : 'validate';
    }


    function _result(result) {
        if (self._opts.allErrors) {
            if (result.missing && result.missing.length) {                
                result.valid = false;
                result.errors = (result.errors || []).concat(_missing(result.missing));
                delete result.missing;
            }
            return result;
        } else {
            var errors = [];
            if (self.tv4.error) errors.push(self.tv4.error);
            if (self.tv4.missing && self.tv4.missing.length) {
                result = false;
                errors = errors.concat(_missing(self.tv4.missing));
            }
            return { valid: result, errors: errors };
        }
    }


    function _missing(missing) {
        return missing.map(function(id) {
            return { missing_schema: id };
        });
    }


    function _regexp(formatName, format) {
        return format instanceof RegExp ? testRegExp : format;

        function testRegExp(data) {
            var ok = typeof data == 'string' && format.test(data);
            return ok ? null : data + 'should be "' + formatName + '"';
        }
    }


    function addSchema(schema, id) {
        schema = util.parse(schema);
        var id = id || schema.id;
        _schemas[id] = schema;
        self.tv4.addSchema(id, schema);
    }


    function getSchema(id) {
        return _schemas[id] || self.tv4.getSchema(id);
    }
}
