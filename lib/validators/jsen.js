'use strict';


var jsen = require('jsen')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this._opts = util.copy(opts);
    var _schemas = this._opts.schemas = this._opts.schemas || {};
    this._compiled = {};

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas) addSchema(_schemas[id], id);


    function validate(schema, json) {
        var v = self.compile(schema);
        return v(json);
    }


    function compile(schema) {
        schema = util.parse(schema);
        var schemaStr = stableStringify(schema);
        var v = self._compiled[schemaStr]
        if (!v) v = self._compiled[schemaStr] = jsen(schema, self._opts);

        return function validate(json) {
            var result = v(json);
            return { valid: result, errors: v.errors || [] };
        };
    }


    function addSchema(schema, id) {
        throw new Error('jsen: adding schema is not supported');
        // schema = util.parse(schema);
        // if (Array.isArray(schema))
        //     return schema.forEach(function(s) { addSchema(s); }); // !!! second parameter must be undefined, so you can't just pass addSchema to forEach
        // var id = id || schema.id;
        // _schemas[id] = schema;
        // compile(schema);
    }


    function getSchema(id) {
        throw new Error('jsen: adding schema is not supported');
        // return _schemas[id];
    }
}
