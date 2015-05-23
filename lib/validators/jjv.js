'use strict';


var jjv = require('jjv')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this.jjv = jjv();
    this._opts = util.copy(opts);
    var _schemas = this._opts.schemas = this._opts.schemas || {};
    var _formats = this._opts.formats || {};

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas) addSchema(_schemas[id], id);
    for (var f in _formats) this.jjv.addFormat(f, util.regexp(_formats[f]));


    function validate(schema, json) {
        return _result(self.jjv.validate(util.parse(schema), json));
    }


    function compile(schema) {
        schema = util.parse(schema);
        var id = schema.id;
        if (id) addSchema(schema, id);

        return function validate(json) {
            return _result(self.jjv.validate(id || schema, json));
        };
    }


    function _result(errors) {
        return { valid: !errors, errors: errors || [] };
    }


    function addSchema(schema, id) {
        schema = util.parse(schema);
        var id = id || schema.id;
        _schemas[id] = schema;
        self.jjv.addSchema(id, schema);
    }


    function getSchema(id) {
        return _schemas[id];
    }
}
