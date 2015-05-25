'use strict';


var ZSchema = require('z-schema')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this._opts = util.options(opts, 'breakOnFirstError');
    var _schemas = this._opts.schemas || {};
    var _formats = this._opts.formats || {};
    delete this._opts.schemas;
    delete this._opts.formats;
    this._compiled = {};

    this.zschema = new ZSchema(this._opts);


    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas) addSchema(_schemas[id], id);
    for (var f in _formats) ZSchema.registerFormat(f, util.regexp(_formats[f]));


    function validate(schema, json) {
        var v = compile(schema);
        return v(json);
    }


    function compile(schema) {
        schema = util.parse(schema);
        var schemaStr = stableStringify(schema);
        var v = self._compiled[schemaStr];
        if (!v) {
            addSchema(schema);
            v = self._compiled[schemaStr] = validate;
        }
        return v;

        function validate(json) {
            return _result(self.zschema.validate(json, schema));
        };
    }


    function _result(valid) {
        var errors = self.zschema.getLastErrors();
        return { valid: valid, errors: errors || [] };
    }


    function addSchema(schema) {
        schema = util.parse(schema);
        var id = schema.id;
        if (id) _schemas[id] = schema;
        self.zschema.validateSchema([schema]);
    }


    function getSchema(id) {
        return _schemas[id];
    }
}
