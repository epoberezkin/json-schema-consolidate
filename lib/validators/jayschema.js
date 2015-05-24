'use strict';


var JaySchema = require('jayschema')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this.jayschema = new JaySchema;
    this._opts = util.copy(opts);
    var _schemas = this._opts.schemas = this._opts.schemas || {};
    var _formats = this._opts.formats || {};

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas) addSchema(_schemas[id], id);
    for (var f in _formats) this.jayschema.addFormat(f, _customFormat(f, _formats[f]));


    function validate(schema, json) {
        return _result(self.jayschema.validate(json, util.parse(schema)));
    }


    function compile(schema) {
        schema = util.parse(schema);

        return function validate(json) {
            return _result(self.jayschema.validate(json, schema));
        };
    }


    function _result(errors) {
        return { valid: !(errors && errors.length), errors: errors || [] };
    }


    function _missing(missing) {
        return missing.map(function(id) {
            return { missing_schema: id };
        });
    }


    function _customFormat(formatName, format) {
        if (format instanceof RegExp) format = util.regexp(format);
        return typeof format == 'function' ? funcFormat : format;

        function funcFormat(data) {
            var ok = format(data);
            return ok ? null : data + 'should be "' + formatName + '"';
        }
    }


    function addSchema(schema, id) {
        schema = util.parse(schema);
        var id = id || schema.id;
        _schemas[id] = schema;
        self.jayschema.register(schema, id);
    }


    function getSchema(id) {
        return _schemas[id];
    }
}
