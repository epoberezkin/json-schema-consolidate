'use strict';


var ZSchema = require('z-schema')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    var _schemas = opts && opts.schemas || {};
    var _formats = opts && opts.formats || {};
    this._opts = convertOpts(opts);
    this.zschema = new ZSchema(this._opts);


    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas) addSchema(_schemas[id], id);
    for (var f in _formats) ZSchema.registerFormat(f, util.regexp(_formats[f]));


    function validate(schema, json) {
        return _result(self.zschema.validate(json, util.parse(schema)));
    }


    function compile(schema) {
        schema = util.parse(schema);
        addSchema(schema);

        return function validate(json) {
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


function convertOpts(opts) {
    var _opts = opts ? util.copy(opts) : {};
    _opts.breakOnFirstError = !_opts.allErrors;
    delete _opts.allErrors;
    delete _opts.verbose;
    delete _opts.schemas;
    delete _opts.formats;
    return _opts;
}
