'use strict';


var imjv = require('is-my-json-valid');
var stableStringify = require('json-stable-stringify');


module.exports = Validator;


function Validator(opts) {
    this._opts = convertOpts(opts);
    this._opts.schemas = this._opts.schemas || {};
    this._validators = {};
}


Validator.prototype.validate = validate;
Validator.prototype.compile = compile;
Validator.prototype.addSchema = addSchema;
Validator.prototype.getSchema = getSchema;


function validate(json, schema) {
    var v = this.compile(schema);
    var result = v(json);
    return { valid: result, errors: v.errors };
}


function compile(schema) {
    if (typeof schema == 'string')
        schema = JSON.parse(schema);
    var schemaStr = stableStringify(schema);
    var v = this._validators[schemaStr]
    if (!v) v = this._validators[schemaStr] = imjv(schema, this._opts);

    return function validate() {
        var result = v(json);
        return { valid: result, errors: v.errors };
    };
}


function addSchema(schema, id) {
    var id = id || schema.id;
    this._opts.schemas[id] = schema;
}


function getSchema(id) {
    return this._opts.schemas[id];
}


function convertOpts(opts) {
    var _opts = opts ? copy(opts) : {};
    _opts.greedy = opts.allErrors;
    return {
        greedy: opts.allErrors,
        verbose: opts.verbose,
        schemas: opts.schemas,
        formats: opts.formats
    };
}
