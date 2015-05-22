'use strict';


var jjv = require('jjv');
var stableStringify = require('json-stable-stringify');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this.jjv = jjv();
    this._opts = copy(opts);
    var _schemas = this._opts.schemas = this._opts.schemas || {};
    var _formats = this._opts.formats || {};

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas) addSchema(_schemas[id], id);
    for (var f in _formats) this.jjv.addFormat(f, _regexp(_formats[f]));


    function validate(schema, json) {
        return _result(self.jjv.validate(_parse(schema), json));
    }


    function compile(schema) {
        schema = _parse(schema);
        var id = schema.id;
        if (id) addSchema(schema, id);

        return function validate(json) {
            return _result(self.jjv.validate(id || schema, json));
        };
    }


    function _regexp(format) {
        return format instanceof RegExp ? testRegExp : format;

        function testRegExp(data) {
            return typeof data == 'string' && format.test(data);
        }
    }


    function _parse(schema) {
        return typeof schema == 'string' ? JSON.parse(schema) : schema;
    }


    function _result(errors) {
        return { valid: !errors, errors: errors || [] };
    }


    function addSchema(schema, id) {
        var id = id || schema.id;
        _schemas[id] = schema;
        self.jjv.addSchema(id, schema);
    }


    function getSchema(id) {
        return _schemas[id];
    }
}


function copy(o, to) {
    to = to || {};
    for (var key in o) to[key] = o[key];
    return to;
}
