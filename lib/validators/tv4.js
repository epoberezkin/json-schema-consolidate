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
    for (var f in _formats) this.tv4.addFormat(f, util.regexp(_formats[f]));


    function validate(schema, json) {
        return self.tv4[_method()](json, util.parse(schema));
    }


    function compile(schema) {
        schema = util.parse(schema);

        return function validate(json) {
            return self.tv4[_method()](json, schema);
        };
    }


    function _method() {
        return self._opts.allErrors ? 'validateMultiple' : 'validate';
    }


    function addSchema(schema, id) {
        var id = id || schema.id;
        _schemas[id] = schema;
        self.tv4.addSchema(id, schema);
    }


    function getSchema(id) {
        return _schemas[id] || self.tv4.getSchema(id);
    }
}
