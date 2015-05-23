'use strict';


var Jsonschema = require('jsonschema').Validator
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this.jsonschema = new Jsonschema;
    this._opts = util.options(opts, 'throwError');
    var _schemas = this._opts.schemas = this._opts.schemas || {};
    if (this._opts.formats) console.error('jsonschema: custom formats not supported');

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas) addSchema(_schemas[id], id);


    function validate(schema, json) {
        var schema = util.parse(schema);
        return _validate(schema, json);
    }


    function compile(schema) {
        schema = util.parse(schema);
        var id = schema.id;
        if (id) addSchema(schema, id);

        return function validate(json) {
            return _validate(schema, json);
        };
    }


    function _validate(schema, json) {
        try { return self.jsonschema.validate(json, schema, self._opts); }
        catch(error) { return {valid: false, errors: [error]} }
    }


    function addSchema(schema, id) {
        schema = util.parse(schema);
        var id = id || schema.id;
        _schemas[id] = schema;
        self.jsonschema.addSchema(schema, id);
    }


    function getSchema(id) {
        return _schemas[id];
    }
}
