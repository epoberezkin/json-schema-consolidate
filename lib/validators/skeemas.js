'use strict';


var skeemas = require('skeemas')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this.skeemas = skeemas();
    this._opts = util.options(opts, 'breakOnError');
    var _schemas = this._opts.schemas = this._opts.schemas || {};
    if (this._opts.formats) console.error('skeemas: custom formats not supported');

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas) addSchema(_schemas[id], id);


    function validate(schema, json) {
        return self.skeemas.validate(json, util.parse(schema), self._opts);
    }


    function compile(schema) {
        schema = util.parse(schema);
        var id = schema.id;
        if (id) addSchema(schema, id);

        return function validate(json) {
            return self.skeemas.validate(json, id || schema, self._opts);
        };
    }


    function addSchema(schema, id) {
        schema = util.parse(schema);
        var id = id || schema.id;
        _schemas[id] = schema;
        self.skeemas.addRef(id, schema);
    }


    function getSchema(id) {
        return _schemas[id];
    }
}
